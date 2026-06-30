import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là "Mei Assistant" — chuyên gia tư vấn thời trang tâm huyết của Mei Closet. Bạn không chỉ là một chatbot, mà là một người bạn sành điệu, am hiểu sâu sắc về thời trang Vintage và đồ Len thủ công (Handmade Knitwear).

Thông tin cốt lõi về Mei Closet:
1. Sản phẩm:
   - Đồ Vintage: Được tuyển chọn kỹ lưỡng, mỗi món là duy nhất, mang linh hồn của thời gian.
   - Shop Len: 100% sản phẩm (áo, khăn, mũ, túi) đều được đan/móc tay bởi các nghệ nhân. Chất liệu chủ đạo là len sợi tự nhiên, mềm mại, không ngứa.
2. Sứ mệnh: Mang lại vẻ đẹp hoài cổ nhưng vẫn hiện đại, bền vững và cá nhân hóa cho khách hàng.
3. Chính sách: Free ship toàn quốc, đổi trả 7 ngày nếu lỗi, bảo hành đường len trọn đời.

Quy trình tư vấn của bạn (HÃY LÀM THEO):
- Bước 1: Lắng nghe nhu cầu (Dịp gì? Phong cách gì? Ngân sách bao nhiêu?).
- Bước 2: Tư vấn Size thông minh (Hỏi chiều cao, cân nặng, số đo nếu cần. Đồ len thường co giãn tốt, mặc Freesize thoải mái cho 45-65kg).
- Bước 3: Gợi ý phối đồ (Mix & Match). Ví dụ: Áo len đan tay mix cùng chân váy vintage hoa nhí + Boots.
- Bước 4: Hướng dẫn bảo quản (Đồ len: giặt tay nước lạnh, phơi nằm ngang. Đồ vintage: giặt nhẹ, tránh chất tẩy mạnh).

Ngôn ngữ & Phong cách:
- Xưng hô: "Mei" và "bạn" (hoặc "nàng").
- Giọng văn: Ngọt ngào, tinh tế, truyền cảm hứng. Sử dụng emoji như 🌸, 🧶, ✨, 🌿 một cách duyên dáng.
- Trả lời: Sâu sắc nhưng không rườm rà. Nếu không biết rõ sản phẩm cụ thể, hãy mời khách ghé thăm trang chủ hoặc nhắn tin qua Zalo/Facebook của shop để xem ảnh thật.

Lưu ý quan trọng: Luôn nhấn mạnh vào giá trị "Thủ công" và "Độc bản" của sản phẩm.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback: smart rule-based responses khi chưa có API key
      const lastMsg = (messages[messages.length - 1]?.content ?? "").toLowerCase();
      const reply = getFallbackResponse(lastMsg);
      return NextResponse.json({ reply });
    }

    const chatMessages = Array.isArray(messages) ? messages : [];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...chatMessages.map((m: { role?: string; content?: string }) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content ?? "",
          })),
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("AI provider error:", err);
      return NextResponse.json({ reply: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé! 🙏" });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Tôi không hiểu câu hỏi, bạn có thể nói rõ hơn không? 😊";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Advisor error:", err);
    return NextResponse.json({ reply: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại! 🙏" });
  }
}

function getFallbackResponse(msg: string): string {
  if (msg.includes("size") || msg.includes("cỡ") || msg.includes("size") || msg.includes("vừa") || msg.includes("rộng") || msg.includes("chật")) {
    return "Để chọn size phù hợp, bạn đo vòng ngực, vòng eo và chiều cao rồi so với bảng size nhé! 📏 Thông thường người Việt hay chọn M hoặc L. Nếu phân vân giữa 2 size, mình khuyên chọn size lớn hơn để thoải mái hơn.";
  }
  if (msg.includes("len") || msg.includes("knit") || msg.includes("handmade") || msg.includes("thủ công")) {
    return "Sản phẩm len của Mei Closet đều được đan tay 100% thủ công từ len chất lượng cao 🧶 Để bảo quản tốt, bạn nên giặt tay với nước lạnh, tránh vắt mạnh và phơi nằm ngang để không bị giãn nhé!";
  }
  if (msg.includes("phối") || msg.includes("mix") || msg.includes("mặc") || msg.includes("phong cách") || msg.includes("style")) {
    return "Mình gợi ý phối áo len với quần jeans cao cạp hoặc chân váy midi là combo cực xinh cho mùa đông 🌿 Thêm chiếc túi tote và boots là hoàn hảo! Bạn thích phong cách vintage, minimal hay streetwear?";
  }
  if (msg.includes("giá") || msg.includes("bao nhiêu") || msg.includes("tiền") || msg.includes("rẻ") || msg.includes("đắt")) {
    return "Giá sản phẩm tại Mei Closet dao động từ 150.000đ đến 650.000đ 💝 Phụ kiện len từ 150k, áo len từ 350k-500k. Tất cả đều là hàng chất lượng, nhiều món còn mới hoặc như mới nhé!";
  }
  if (msg.includes("giao hàng") || msg.includes("ship") || msg.includes("vận chuyển")) {
    return "Mei Closet miễn phí giao hàng toàn quốc 🚚 Thời gian giao từ 2-5 ngày làm việc. Bạn có thể đổi trả trong vòng 7 ngày nếu sản phẩm không như mô tả nhé!";
  }
  if (msg.includes("mua") || msg.includes("đặt") || msg.includes("cart") || msg.includes("giỏ")) {
    return "Để mua hàng, bạn chọn sản phẩm, chọn size rồi nhấn 'Thêm vào giỏ' hoặc 'Mua ngay' nhé 🛍️ Bạn cần đăng nhập để hoàn tất đơn hàng. Nếu chưa có tài khoản, đăng ký rất nhanh thôi!";
  }
  if (msg.includes("giặt") || msg.includes("bảo quản") || msg.includes("wash") || msg.includes("care")) {
    return "Với đồ vintage và đồ len, mình khuyên: giặt tay với nước lạnh, dùng nước xả vải nhẹ, không ngâm lâu, phơi trong mát tránh ánh nắng trực tiếp ☁️ Đồ len nên phơi nằm ngang để giữ form!";
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("xin chào") || msg.includes("chào")) {
    return "Xin chào! Mình là trợ lý tư vấn của Mei Closet 🌸 Mình có thể giúp bạn tìm sản phẩm phù hợp, tư vấn phối đồ, hướng dẫn chọn size hoặc giải đáp thắc mắc về đơn hàng nhé!";
  }
  return "Cảm ơn bạn đã hỏi! 😊 Mình có thể tư vấn về size, phối đồ, chất liệu len, cách bảo quản, hoặc gợi ý sản phẩm phù hợp. Bạn muốn hỏi về điều gì?";
}
