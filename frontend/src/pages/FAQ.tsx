import React, { useState, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// FAQ data structure
const faqSections = {
  "সাধারণ বিষয়": [
    {
      question: "Bhara কী?",
      answer: "Bhara একটি ভাড়া ভিত্তিক মার্কেটপ্লেস যেখানে আপনি আপনার পণ্য ভাড়া দিতে পারেন কিংবা অন্যদের কাছ থেকে ভাড়া নিতে পারেন।"
    },
    {
      question: "কারা ব্যবহার করতে পারে Bhara?",
      answer: "যে কেউ যার কাছে দরকারি কিছু আছে এবং সেটা কিছু সময়ের জন্য অন্যদের কাজে লাগাতে চান বা যাদের কিছু দরকার কিন্তু কিনতে চান না, তারা ভাড়া নিয়ে সাময়িকভাবে ব্যবহার করতে চান।"
    }
  ],

  "ভাড়া প্রদানকারীর জন্য (Product Owners)": [
    {
      question: "ভাড়া দেয়ার জন্য আমার কী লাগবে?",
      answer: "আপনার প্রোডাক্টের ভালো মানের ছবি, একটি নির্দিষ্ট ভাড়া মূল্য, প্রয়োজনীয় শর্তাবলি এবং একটি মৌলিক বিবরণ।"
    },
    {
      question: "আমি তো কাউকে চিনি না, তাহলে কিভাবে নিশ্চিন্ত হবো?",
      answer: "আপনাকে কাউকে ব্যক্তিগতভাবে কিছু দিতে হবে না। আমরাই পুরো ভাড়া প্রক্রিয়ার মধ্যস্থতাকারী হিসেবে কাজ করি। আপনি আমাদের মাধ্যমে আপনার জিনিসটি ভাড়া দেন, এবং আবার ফেরতও আমাদের মাধ্যমেই পান।"
    },
    {
      question: "যদি ভাড়া নেওয়া ব্যক্তি জিনিসটা নষ্ট করে, দেরি করে বা ফেরত না দেয় তাহলে?",
      answer: "এই বিষয়ে সম্পূর্ণ দায় আমাদের। আমরা ভাড়া নেওয়ার আগে একটি লিখিত চুক্তি করি যেখানে ক্ষতির শর্ত, দেরির চার্জ, বা না ফেরানোর ক্ষেত্রে আমাদের কী পদক্ষেপ থাকবে তা স্পষ্টভাবে উল্লেখ থাকে। আপনার জিনিসে যদি কোনো সমস্যা হয়, তাহলে ক্ষতিপূরণ আমরা আপনাকে দিই—এটা আপনার চিন্তার বিষয় নয়।"
    },
    {
      question: "আমি কি নিরাপত্তার জন্য সিকিউরিটি ডিপোজিট চাইতে পারি?",
      answer: "হ্যাঁ, চাইতে পারেন। আপনি চাইলে আপনার প্রোডাক্টে একটি নির্দিষ্ট পরিমাণ সিকিউরিটি ডিপোজিট সেট করতে পারেন। এই অর্থটি ভাড়া নেওয়ার আগেই সংগ্রহ করা হয় এবং কোনো সমস্যা না হলে সেটা ফেরত দেওয়া হয়।"
    },
    {
      question: "আমি কিভাবে জানবো কে আমার জিনিস ভাড়া নিচ্ছে?",
      answer: "আপনার পক্ষে জানার দরকার নেই। আমরা তাদের তথ্য যাচাই করি, তাদের সাথে চুক্তি করি এবং প্রয়োজন হলে আইনি পদক্ষেপ নিতে পারি। আপনি শুধু আমাদেরকে চিনবেন, এবং আমরা দুইপক্ষের মধ্যে নিরাপত্তা নিশ্চিত করবো।"
    },
    {
      question: "এটা কি নিরাপদ? আমি কিভাবে বিশ্বাস করবো?",
      answer: "আমরা একটি নিরাপদ ও স্বচ্ছ ভাড়া ব্যবস্থা তৈরির চেষ্টা করছি, যেখানে আপনি কোনো ঝুঁকি না নিয়েই আপনার জিনিস অন্যকে ব্যবহার করতে দিতে পারেন। আপনার সুরক্ষা, ক্ষতিপূরণ এবং বিশ্বাসযোগ্যতা—এই তিনটি বিষয়কে আমরা সর্বোচ্চ গুরুত্ব দেই।"
    }
  ],

  "ভাড়া গ্রহণকারীর জন্য (Renters)": [
    {
      question: "আমি কীভাবে জানবো কোন প্রোডাক্ট ভাড়া পাওয়া যাচ্ছে?",
      answer: "Bhara ওয়েবসাইটে সার্চ করে বা ক্যাটাগরি অনুযায়ী ব্রাউজ করে প্রোডাক্ট খুঁজে পাওয়া যায়।"
    },
    {
      question: "আমি সরাসরি মালিকের সাথে কথা বলতে পারবো?",
      answer: "না, নিরাপত্তা নিশ্চিত করার জন্য আমরা মধ্যস্থতাকারী হিসেবে কাজ করি।"
    },
    {
      question: "কীভাবে রিকুয়েস্ট পাঠাতে হয়?",
      answer: "প্রোডাক্ট পেইজে গিয়ে 'ভাড়া নিতে চাই' বা 'Request Rental' বাটনে ক্লিক করে তারিখসহ প্রয়োজনীয় তথ্য দিন।"
    },
  ],

  "প্রসেস এবং নিরাপত্তা": [
    {
      question: "ভাড়া নেয়ার পুরো প্রক্রিয়া কীভাবে কাজ করে?",
      answer: "ভাড়া গ্রহণকারী অনুরোধ পাঠালে, আমরা মালিকের কাছ থেকে প্রোডাক্ট সংগ্রহ করি, যাচাই করি, তারপর ভাড়া গ্রহণকারীর হাতে পৌঁছে দেই। সময়মতো ফেরত না দিলে জরিমানা ধার্য হয় এবং ক্ষতির দায় Bhara নেয়।"
    },
    {
      question: "ভাড়া নেয়ার সময় চুক্তি বা গ্যারান্টি কিছু থাকে?",
      answer: "হ্যাঁ, পরিচয় যাচাই, মৌখিক চুক্তি এবং প্রয়োজনমতো সিকিউরিটি ডিপোজিট নেওয়া হয়।"
    },
    {
      question: "আমি যদি কিছু ভেঙে ফেলি বা হারিয়ে ফেলি?",
      answer: "আপনি ক্ষতিপূরণ দিতে বাধ্য থাকবেন। আমরা এই শর্ত আগেই জানিয়ে দেই এবং চুক্তিতে রাখি।"
    },
    {
      question: "যদি আমার প্রোডাক্ট নষ্ট হয়ে যায় বা হারিয়ে যায়?",
      answer: "Bhara সেই ক্ষেত্রে ক্ষতিপূরণের ব্যবস্থা করে। আমরা আগেই ভাড়া নেওয়ার সময় নিরাপত্তা চুক্তি, আইডি যাচাই এবং ডিপোজিট গ্রহণ করি।"
    },
    {
      question: "রেন্টার দেরিতে প্রোডাক্ট ফেরত দিলে কী হবে?",
      answer: "প্রতিটি লিস্টে লেট ফি-এর নিয়ম উল্লেখ থাকবে, এবং দেরি হলে তা কেটে রাখা হবে।"
    }
  ],

  "প্রোডাক্ট আপলোড সংক্রান্ত": [
    {
      question: "কিভাবে আমি আমার প্রোডাক্ট Bhara-তে আপলোড করব?",
      answer: "ওয়েবসাইটে লগইন করার পর 'ভাড়া দিতে চান?' বাটনে ক্লিক করে প্রোডাক্টের নাম, বিবরণ, ছবি এবং ভাড়ার শর্ত দিয়ে সাবমিট করুন।"
    },
    {
      question: "কোন ধরণের প্রোডাক্ট ভাড়া দেওয়া যাবে?",
      answer: "ক্যাম্পিং গিয়ার, ইভেন্ট আইটেম, ইলেকট্রনিকস, স্পোর্টস গিয়ার, ক্যামেরা ইত্যাদি—কিছুই আপলোড করা যাবে, তবে অবৈধ বা ঝুঁকিপূর্ণ কিছু নয়।"
    },
    {
      question: "আমি একাধিক প্রোডাক্ট আপলোড করতে পারি কি?",
      answer: "হ্যাঁ, আপনি আপনার একাধিক পণ্যের জন্য আলাদা আলাদা লিস্ট তৈরি করতে পারেন।"
    },
    {
      question: "আমি কীভাবে প্রোডাক্ট আপলোড করবো?",
      answer: "লগইন করার পর 'ভাড়া দিতে চান?' বা 'Upload Product' বাটনে ক্লিক করে ছবি, বিবরণ, চার্জ ইত্যাদি দিন।"
    },
    {
      question: "কতগুলো প্রোডাক্ট আপলোড করা যাবে?",
      answer: "আপনি যত খুশি আপলোড করতে পারেন।"
    },
    {
      question: "সব ধরণের প্রোডাক্টই কি ভাড়া দেওয়া যাবে?",
      answer: "না, ঝুঁকিপূর্ণ বা অবৈধ কিছু নয়। কিন্তু ক্যাম্পিং গিয়ার, ক্যামেরা, ইভেন্টের জিনিস, সাইকেল ইত্যাদি সবই চলবে।"
    }
  ],

  "পেমেন্ট ও ডিপোজিট": [
    {
      question: "পেমেন্ট কিভাবে হবে?",
      answer: "পেমেন্ট অফলাইনে বা মোবাইল পেমেন্টের মাধ্যমে করা হয়। Bhara প্ল্যাটফর্ম সরাসরি পেমেন্ট প্রসেস করে না।"
    },
    {
      question: "ডিপোজিট কি বাধ্যতামূলক?",  
      answer: "কিছু প্রোডাক্টে মালিক ডিপোজিট চাইতে পারেন, যা রেন্টাল শেষে ফেরতযোগ্য।"
    },
    {
      question: "পেমেন্ট ফেরত কীভাবে পাবো?",
      answer: "প্রোডাক্ট ফেরতের পর সব ঠিক থাকলে ডিপোজিট ফেরত দেওয়া হয়। এটি সাধারণত অফলাইনে বা মোবাইল পেমেন্টের মাধ্যমে সম্পন্ন হয়।"
    }
  ],

  "জেনারেল / অন্যান্য": [
    {
      question: "ভাড়া নিলে বা দিলে আমি অন্যজনকে চিনবো?",
      answer: "না, দুই পক্ষই শুধু Bhara-কে চিনবে। এতে করে নিরাপত্তা ও গোপনীয়তা বজায় থাকবে।"
    },
    {
      question: "আমার প্রোডাক্ট কেউ না নিলে?",
      answer: "আপনি চাইলে ছবি, দাম বা বিবরণ আপডেট করতে পারেন, আমরা হাইলাইটও করতে পারি।"
    },
  ]
};



const FAQ = () => {
  const [activeSection, setActiveSection] = useState<string | null>(Object.keys(faqSections)[0]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Create a temporary element with all FAQ sections expanded
      const tempDiv = document.createElement('div');
      tempDiv.className = pdfRef.current.className;
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Hind Siliguri, sans-serif';
      
      // Add title
      const titleElement = document.createElement('h1');
      titleElement.innerText = 'সাধারণ জিজ্ঞাসা (FAQ)'; 
      titleElement.style.fontSize = '24px';
      titleElement.style.marginBottom = '20px';
      titleElement.style.color = '#166534'; // green-800
      tempDiv.appendChild(titleElement);
      
      // Process all FAQ sections
      Object.entries(faqSections).forEach(([sectionTitle, questions], sectionIndex) => {
        // Add section title
        const sectionElement = document.createElement('h2');
        sectionElement.innerText = sectionTitle;
        sectionElement.style.fontSize = '20px';
        sectionElement.style.marginTop = '25px';
        sectionElement.style.marginBottom = '15px';
        sectionElement.style.color = '#166534'; // green-800
        tempDiv.appendChild(sectionElement);
        
        // Add questions and answers
        questions.forEach((item, itemIndex) => {
          // Question
          const questionElement = document.createElement('h3');
          questionElement.innerText = `${itemIndex + 1}. ${item.question}`;
          questionElement.style.fontSize = '16px';
          questionElement.style.fontWeight = 'bold';
          questionElement.style.marginTop = '15px';
          questionElement.style.marginBottom = '8px';
          tempDiv.appendChild(questionElement);
          
          // Answer
          const answerElement = document.createElement('p');
          answerElement.innerText = item.answer;
          answerElement.style.marginBottom = '12px';
          answerElement.style.fontSize = '14px';
          tempDiv.appendChild(answerElement);
          
          // Add separator except for the last question in the section
          if (itemIndex < questions.length - 1) {
            const separator = document.createElement('hr');
            separator.style.margin = '15px 0';
            separator.style.border = '0.5px solid #e5e7eb';
            tempDiv.appendChild(separator);
          }
        });
      });
      
      // Append the temporary element to the body (required for html2canvas)
      document.body.appendChild(tempDiv);
      
      // Generate canvas from temp element
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary element
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Get canvas dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add image to PDF (first page)
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        position, 
        imgWidth, 
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageHeight;
      
      // Add new pages if the content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'), 
          'PNG', 
          0, 
          position, 
          imgWidth, 
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save('Bhara-FAQ.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF নির্মাণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'); // Error message in Bangla
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-12">
      <NavBar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 font-['Hind_Siliguri']">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 font-['Hind_Siliguri']">
            আপনার প্রশ্নের উত্তর খুঁজুন
          </p>
          
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            {Object.keys(faqSections).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors font-['Hind_Siliguri'] ${
                  activeSection === section
                    ? 'bg-lime-600 text-white'
                    : 'bg-lime-100 text-green-900 hover:bg-lime-200'
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div ref={pdfRef} className="bg-white rounded-lg shadow-md p-6 mt-6">
            {activeSection && (
              <>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-green-900 font-['Hind_Siliguri']">{activeSection}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqSections[activeSection as keyof typeof faqSections].map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-green-900 text-base font-['Hind_Siliguri']">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 font-['Hind_Siliguri']">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </div>
        </div>
      </div>
      {/* PDF Download Link */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 mb-10 text-center">
        <button 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className={`inline-flex items-center px-4 py-2 ${isGeneratingPDF ? 'bg-lime-400' : 'bg-lime-600'} text-white rounded hover:bg-lime-700 transition-colors font-['Hind_Siliguri']`}
        >
          <FiDownload className="mr-2" /> 
          {isGeneratingPDF ? 'PDF নির্মাণ হচ্ছে...' : 'FAQ ডাউনলোড করুন (PDF)'}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
