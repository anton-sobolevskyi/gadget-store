import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { aboutLinks, supportLinks, policyLinks } from "@/lib/constants";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const icons = [
  {
    href: "https://www.facebook.com",
    name: "Facebook",
    icon: <SiFacebook className="w-5 h-5" />,
  },
  {
    href: "https://www.instagram.com",
    name: "Instagram",
    icon: <SiInstagram className="w-5 h-5" />,
  },
  {
    href: "https://www.twitter.com",
    name: "Twitter",
    icon: <SiX className="w-5 h-5" />,
  },
  {
    href: "https://www.youtube.com",
    name: "YouTube",
    icon: <SiYoutube className="w-5 h-5" />,
  },
];

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GadgetHub</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your trusted destination for the latest gadgets and technology.
              Quality products, competitive prices, and exceptional service.
            </p>
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-3">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              {aboutLinks.map(({ href, name }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map(({ href, name }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              {policyLinks.map(({ href, name }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2026 GadgetHub. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {icons.map(({ href, icon, name }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
