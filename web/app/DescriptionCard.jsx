"use client";

export default function DescriptionCard({children}) {
  return (
    <div className='flex items-center bg-gray-100 p-3 rounded-3xl text-[#4a4a4a] text-sm'>
        {children}
    </div>
  );
}
