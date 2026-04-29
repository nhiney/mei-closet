import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Bạn là trợ lý tư vấn thời trang AI của Mei Closet — một cửa hàng thời trang vintage và len handmade.

Thông tin về Mei Closet:
- Chuyên bán quần áo vintage, second-hand chất lượng cao và sản phẩm len đan tay thủ công
- Có các danh mục: Áo (shirt), Quần (pants), Váy (skirts/others), Áo khoác (jacket), Đồ len (knitwear)
- Shop Len: áo len, cardigan, quần len, váy len, phụ kiện len — 100% handmade
- Mức giá từ 150.000đ đến 650.000đ
- Giao hàng miễn phí, đổi trả trong 7 ngày

Nhiệm vụ:
- Tư vấn phong cách, cách phối đồ, chọn size
- Gợi ý sản phẩm phù hợp theo nhu cầu khách
- Giải đáp thắc mắc về chất liệu, cách giặt, bảo quản đồ len
- Trả lời ngắn gọn, thân thiện bằng tiếng Việt
- Nếu khách hỏi về sản phẩm cụ thể không có trong thông tin, hãy hướng khách đến trang chủ để xem

Phong cách trả lời: Thân thiện, chuyên nghiệp, ngắn gọn (3-5 câu). Dùng emoji nhẹ nhàng. Không bịa đặt thông tin.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback: smart rule-based responses khi chưa có API key
      const lastMsg = (messages[messages.length - 1]?.content ?? "").toLowerCase();
      const reply = getFallbackResponse(lastMsg);
      return NextResponse.json({ reply });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ reply: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn vui lòng thử lại sau nhé! 🙏" });
    }

    const data = await res.json();
    const reply = data.content?.[0]?.text ?? "Tôi không hiểu câu hỏi, bạn có thể nói rõ hơn không? 😊";
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
