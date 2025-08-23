import React from 'react';
import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-4">
              آی‌شاپ
            </h3>
            <p className="text-gray-400 leading-relaxed">
              بهترین محصولات از دبی را با قیمت مناسب در سراسر ایران تحویل بگیرید
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">صفحه اصلی</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">محصولات</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">مجله</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">درباره ما</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">تماس با ما</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">راهنمای خرید</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">سوالات متداول</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">شرایط استفاده</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">حریم خصوصی</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تماس با ما</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-reverse space-x-3">
                <Phone size={18} className="text-rose-400" />
                <span className="text-gray-400">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-3">
                <Mail size={18} className="text-rose-400" />
                <span className="text-gray-400">info@ishop.ir</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-3">شبکه‌های اجتماعی</h5>
              <div className="flex space-x-reverse space-x-4">
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © ۱۴۰۳ آی‌شاپ. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
