"use client";

import React from 'react';

export function RazorpayDirectButton() {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:border-primary/20 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#ff2d2d"/>
            <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#ff2d2d"/>
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Pay Directly</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">One-Click Secure Checkout</p>
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[100px]">
        {/* Directly using the code you shared — Raw injection */}
        <div 
          className="razorpay-embed-container w-full"
          dangerouslySetInnerHTML={{ 
            __html: `<form><script src="https://checkout.razorpay.com/v1/payment_button.js" data-payment_button_id="pl_SVV0HW1GPPOJVL" async> </script> </form>` 
          }} 
        />
        <p className="text-[9px] text-slate-300 font-bold uppercase mt-4 tracking-tighter">
          Powered By official Razorpay SDK
        </p>
      </div>
    </div>
  );
}
