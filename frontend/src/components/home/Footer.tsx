import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-lime-50 to-white text-green-900 pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 lg:gap-14 xl:gap-20 mb-10 md:mb-12 lg:mb-14 xl:mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 max-w-lg pr-4 lg:pr-8">
            <a href="/" className="flex items-center text-lg md:text-xl font-bold mb-2 md:mb-3">
              <span className="text-lime-600 mr-1">V</span>ara
            </a>
            <p className="text-gray-400 text-xs/5 md:text-sm/6 mb-3 md:mb-4">
              The trusted community marketplace for lending and borrowing everyday items. Save money, earn income, and live more sustainably.
            </p>
            <div className="flex gap-2 md:gap-3">
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Facebook size={18} className="text-gray-400" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Twitter size={18} className="text-gray-400" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Instagram size={18} className="text-gray-400" /></a>
              <a href="#" className="rounded-full bg-white p-2 hover:bg-lime-50 border-2 border-gray-200 transition"><Linkedin size={18} className="text-gray-400" /></a>
            </div>
          </div>
          {/* Company Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">Company</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Careers</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Press</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Blog</a></li>
            </ul>
          </div>
          {/* Support Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">Support</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Contact Us</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">FAQ</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Trust & Safety</a></li>
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h4 className="text-green-900 font-semibold mb-2 md:mb-3 text-sm md:text-base lg:text-lg">Legal</h4>
            <ul className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-lime-600 transition text-gray-500 text-xs md:text-sm">Cookie Policy</a></li>
            </ul>
            {/* Language Selector */}
            <div className="mt-4 md:mt-6">
              <Select defaultValue="en">
                <SelectTrigger className="w-full bg-white text-green-900 border-gray-300 text-xs md:text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white text-green-900">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 text-center text-gray-400 text-xs">
          &copy; 2025 Vara, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
