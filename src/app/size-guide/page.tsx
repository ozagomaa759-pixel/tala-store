import Link from "next/link";
import { ArrowLeft, Ruler } from "lucide-react";

const sizes = [
  { size: "XS", bust: "78–82", waist: "60–64", hips: "86–90" },
  { size: "S", bust: "83–87", waist: "65–69", hips: "91–95" },
  { size: "M", bust: "88–92", waist: "70–74", hips: "96–100" },
  { size: "L", bust: "93–98", waist: "75–80", hips: "101–106" },
  { size: "XL", bust: "99–104", waist: "81–86", hips: "107–112" },
];

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#332A23]">
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[#8B7867] hover:text-[#332A23] mb-12"
        >
          <ArrowLeft size={16} />
          Back to Collection
        </Link>

        <div className="text-center mb-14">
          <Ruler className="mx-auto mb-5 text-[#A58A6D]" size={30} />
          <p className="text-xs tracking-[0.4em] uppercase text-[#A58A6D] mb-4">
            TALA Boutique
          </p>
          <h1 className="text-4xl md:text-6xl font-light mb-5">
            Size Guide
          </h1>
          <p className="text-[#81766D] max-w-xl mx-auto leading-8">
            Find your comfortable fit with our general size reference.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#E5DDD2] bg-white">
          <table className="w-full min-w-[600px] text-center">
            <thead className="bg-[#EDE6DC]">
              <tr>
                {["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)"].map((item) => (
                  <th key={item} className="px-5 py-5 text-sm font-medium">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((item) => (
                <tr key={item.size} className="border-t border-[#EEE8E0]">
                  <td className="px-5 py-5 font-semibold">{item.size}</td>
                  <td className="px-5 py-5">{item.bust}</td>
                  <td className="px-5 py-5">{item.waist}</td>
                  <td className="px-5 py-5">{item.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            ["Bust", "Measure around the fullest part of your chest."],
            ["Waist", "Measure around your natural waistline."],
            ["Hips", "Measure around the fullest part of your hips."],
          ].map(([title, description]) => (
            <div key={title} className="bg-[#EEE8E0] p-7">
              <h2 className="text-lg mb-3">{title}</h2>
              <p className="text-sm text-[#81766D] leading-7">
                {description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#8B8178] text-center mt-10 leading-6">
          This chart is a general sizing reference only. Actual measurements
          and fit may vary by product and design. Please check individual
          product details when available.
        </p>
      </section>
    </main>
  );
}
