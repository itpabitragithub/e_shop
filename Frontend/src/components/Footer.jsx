import React, { useState } from 'react'
import { ShoppingCart, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className='bg-slate-900 text-white py-12'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-4 gap-8 mb-8'>
          {/* Column 1 - Company Information */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <ShoppingCart className='text-pink-500 w-8 h-8' />
              <span className='font-bold text-pink-500 text-2xl'>E-Shop</span>
            </div>
            <p className='text-white mb-4 text-sm'>
              Powering Your World with the Best in Electronics.
            </p>
            <div className='space-y-2 text-white text-sm'>
              <p>123 Electronics St, Style City, NY 10001</p>
              <p>support@Zaptro.com</p>
              <p>(123) 456-7890</p>
            </div>
          </div>

          {/* Column 2 - Customer Service */}
          <div>
            <h3 className='font-bold text-white mb-4'>Customer Service</h3>
            <ul className='space-y-2 text-white text-sm'>
              <li>
                <a href='#' className='hover:text-pink-500 transition-colors'>
                  Contact Us
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-pink-500 transition-colors'>
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-pink-500 transition-colors'>
                  FAQs
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-pink-500 transition-colors'>
                  Order Tracking
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-pink-500 transition-colors'>
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Follow Us */}
          <div>
            <h3 className='font-bold text-white mb-4'>Follow Us</h3>
            <div className='flex gap-4'>
              <a
                href='#'
                className='w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors'
                aria-label='Twitter'
              >
                <Twitter className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors'
                aria-label='Pinterest'
              >
                <span className='text-sm font-bold'>P</span>
              </a>
            </div>
          </div>

          {/* Column 4 - Stay in the Loop */}
          <div>
            <h3 className='font-bold text-white mb-4'>Stay in the Loop</h3>
            <p className='text-white text-sm mb-4'>
              Subscribe to get special offers, free giveaways, and more
            </p>
            <div className='flex gap-0'>
              <Input
                type='email'
                placeholder='Your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='rounded-r-none bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus-visible:border-pink-500'
              />
              <Button
                className='bg-pink-500 hover:bg-pink-600 text-white rounded-l-none px-6'
                onClick={() => {
                  // Handle subscribe
                  console.log('Subscribe:', email)
                }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className='border-t border-gray-600 pt-6'>
          <p className='text-white text-sm text-center'>
            © 2025 <span className='text-pink-500 font-semibold'>E-Shop</span>.
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer