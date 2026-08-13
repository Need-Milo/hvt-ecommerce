"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <h1 className="text-3xl font-black text-shop-dark-green">Liên hệ</h1>
        <p className="text-gray-600">
          Gửi câu hỏi về sản phẩm, đơn hàng hoặc hỗ trợ. Đội ngũ Shopcart sẽ
          phản hồi trong giờ làm việc.
        </p>
        <div className="space-y-4 text-sm">
          <p className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-shop-dark-green" />
            123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
          </p>
          <p className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-shop-dark-green" />
            0901 234 567
          </p>
          <p className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-shop-dark-green" />
            support@shopcart.vn
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-4 shadow-sm"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ và tên"
          className="w-full border rounded-md px-3 py-2.5 outline-none focus:border-shop-dark-green"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-md px-3 py-2.5 outline-none focus:border-shop-dark-green"
        />
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nội dung"
          rows={5}
          className="w-full border rounded-md px-3 py-2.5 outline-none focus:border-shop-dark-green"
        />
        <button
          type="submit"
          className="w-full bg-shop-dark-green text-white py-2.5 rounded-md font-semibold hover:bg-shop-light-green hoverEffect"
        >
          Gửi liên hệ
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
