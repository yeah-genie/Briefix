import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nacl from "https://esm.sh/tweetnacl@1.0.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DISCORD_PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY") || "";
const DISCORD_BOT_TOKEN = Deno.env.get("DISCORD_BOT_TOKEN") || "";
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY") || "";

console.log("Discord Freeze Bot v1");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Verify Discord request signature
function verifyRequest(body: string, signature: string, timestamp: string): boolean {
    if (!DISCORD_PUBLIC_KEY) return true; // Skip in dev
    try {
        const message = new TextEncoder().encode(timestamp + body);
        const sig = hexToUint8Array(signature);
        const key = hexToUint8Array(DISCORD_PUBLIC_KEY);
        return nacl.sign.detached.verify(message, sig, key);
    } catch {
        return false;
    }
}

function hexToUint8Array(hex: string): Uint8Array {
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        arr[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return arr;
}

// Translate message using Gemini
async function translate(text: string, targetLang: string): Promise<string> {
    if (targetLang === "en" || !GEMINI_API_KEY) return text;
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Translate to ${targetLang}: "${text}". Return ONLY the translation.` }] }]
                })
            }
        );
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
    } catch { return text; }
}

// Check if text is a valid idea
async function isValidIdea(text: string): Promise<boolean> {
    if (text.length < 8 || !GEMINI_API_KEY) return text.length >= 8;
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Is this an ACTIONABLE PRODUCT/BUSINESS IDEA? yes/no. Message: "${text}"` }] }]
                })
            }
        );
        const data = await res.json();
        return (data.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "").includes("yes");
    } catch { return true; }
}

// Send message to Discord channel
async function sendMessage(channelId: string, content: string, replyTo?: string) {
    const body: any = { content };
    if (replyTo) body.message_reference = { message_id: replyTo };

    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${DISCORD_BOT_TOKEN}`
        },
        body: JSON.stringify(body)
    });
}

// Get message content
async function getMessage(channelId: string, messageId: string): Promise<string> {
    try {
        const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
            headers: { "Authorization": `Bot ${DISCORD_BOT_TOKEN}` }
        });
        const msg = await res.json();
        return msg.content || "";
    } catch { return ""; }
}

serve(async (req) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-signature-ed25519") || "";
        const timestamp = req.headers.get("x-signature-timestamp") || "";

        // Verify signature
        if (!verifyRequest(body, signature, timestamp)) {
            return new Response("Invalid signature", { status: 401 });
        }

        const payload = JSON.parse(body);

        // Discord PING (verification)
        if (payload.type === 1) {
            return new Response(JSON.stringify({ type: 1 }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        // MESSAGE_REACTION_ADD event (type 0 with t = MESSAGE_REACTION_ADD)
        if (payload.t === "MESSAGE_REACTION_ADD") {
            const data = payload.d;
            const emoji = data.emoji?.name;
            const channelId = data.channel_id;
            const messageId = data.message_id;
            const userId = data.user_id;

            // Get original message
            const text = await getMessage(channelId, messageId);
            if (!text) {
                return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
            }

            // ❄️ FREEZE
            if (emoji === "❄️" || emoji === "snowflake") {
                const isIdea = await isValidIdea(text);

                if (!isIdea) {
                    await sendMessage(channelId, await translate("🤔 This doesn't look like an idea.", "en"), messageId);
                } else {
                    const { data: idea } = await supabase.from("ideas").insert({
                        title: text.length > 100 ? text.substring(0, 100) + "..." : text,
                        description: text,
                        status: "Frozen",
                        priority: "Medium",
                        category: "Feature",
                        is_zombie: true,
                        zombie_reason: "Frozen via Discord",
                        discord_message_id: messageId,
                        discord_channel_id: channelId,
                        votes: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }).select().single();

                    await sendMessage(channelId,
                        `${await translate("🧊 Frozen!", "en")} https://cryo-dun.vercel.app/ideas/${idea?.idea_id}`,
                        messageId
                    );
                }
            }

            // 🔥 THAW
            else if (emoji === "🔥" || emoji === "fire") {
                const { data: idea } = await supabase
                    .from("ideas")
                    .select()
                    .eq("discord_message_id", messageId)
                    .single();

                if (!idea) {
                    await sendMessage(channelId, await translate("No idea found for this message.", "en"), messageId);
                } else if (!idea.is_zombie) {
                    await sendMessage(channelId, await translate("Already active.", "en"), messageId);
                } else {
                    await supabase.from("ideas").update({
                        is_zombie: false,
                        status: "Active",
                        zombie_reason: null,
                        updated_at: new Date().toISOString()
                    }).eq("idea_id", idea.idea_id);

                    await sendMessage(channelId,
                        `${await translate("🔥 Thawed! Time to review.", "en")} https://cryo-dun.vercel.app/ideas/${idea.idea_id}`,
                        messageId
                    );
                }
            }

            // 👍 VOTE
            else if (emoji === "👍" || emoji === "+1" || emoji === "thumbsup") {
                const { data: idea } = await supabase
                    .from("ideas")
                    .select()
                    .eq("discord_message_id", messageId)
                    .single();

                if (idea) {
                    await supabase.from("ideas").update({
                        votes: (idea.votes || 0) + 1,
                        updated_at: new Date().toISOString()
                    }).eq("idea_id", idea.idea_id);

                    await sendMessage(channelId,
                        `${await translate("👍 Voted!", "en")} (${(idea.votes || 0) + 1})`,
                        messageId
                    );
                }
            }
        }

        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
});
