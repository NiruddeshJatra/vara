import React, { useState, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import NavBar from '@/components/home/NavBar';
import Footer from '@/components/home/Footer';
import { FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

// FAQ data structure
// FAQ content lives in the locale files (faqPage.sections.*)
const faqSections = [
  { id: "general", titleKey: "faqPage.sections.general.title", items: [{ q: "faqPage.sections.general.q1", a: "faqPage.sections.general.a1" }, { q: "faqPage.sections.general.q2", a: "faqPage.sections.general.a2" }] },
  { id: "owners", titleKey: "faqPage.sections.owners.title", items: [{ q: "faqPage.sections.owners.q1", a: "faqPage.sections.owners.a1" }, { q: "faqPage.sections.owners.q2", a: "faqPage.sections.owners.a2" }, { q: "faqPage.sections.owners.q3", a: "faqPage.sections.owners.a3" }, { q: "faqPage.sections.owners.q4", a: "faqPage.sections.owners.a4" }, { q: "faqPage.sections.owners.q5", a: "faqPage.sections.owners.a5" }, { q: "faqPage.sections.owners.q6", a: "faqPage.sections.owners.a6" }] },
  { id: "renters", titleKey: "faqPage.sections.renters.title", items: [{ q: "faqPage.sections.renters.q1", a: "faqPage.sections.renters.a1" }, { q: "faqPage.sections.renters.q2", a: "faqPage.sections.renters.a2" }, { q: "faqPage.sections.renters.q3", a: "faqPage.sections.renters.a3" }] },
  { id: "process", titleKey: "faqPage.sections.process.title", items: [{ q: "faqPage.sections.process.q1", a: "faqPage.sections.process.a1" }, { q: "faqPage.sections.process.q2", a: "faqPage.sections.process.a2" }, { q: "faqPage.sections.process.q3", a: "faqPage.sections.process.a3" }, { q: "faqPage.sections.process.q4", a: "faqPage.sections.process.a4" }, { q: "faqPage.sections.process.q5", a: "faqPage.sections.process.a5" }] },
  { id: "upload", titleKey: "faqPage.sections.upload.title", items: [{ q: "faqPage.sections.upload.q1", a: "faqPage.sections.upload.a1" }, { q: "faqPage.sections.upload.q2", a: "faqPage.sections.upload.a2" }, { q: "faqPage.sections.upload.q3", a: "faqPage.sections.upload.a3" }, { q: "faqPage.sections.upload.q4", a: "faqPage.sections.upload.a4" }, { q: "faqPage.sections.upload.q5", a: "faqPage.sections.upload.a5" }, { q: "faqPage.sections.upload.q6", a: "faqPage.sections.upload.a6" }] },
  { id: "payment", titleKey: "faqPage.sections.payment.title", items: [{ q: "faqPage.sections.payment.q1", a: "faqPage.sections.payment.a1" }, { q: "faqPage.sections.payment.q2", a: "faqPage.sections.payment.a2" }, { q: "faqPage.sections.payment.q3", a: "faqPage.sections.payment.a3" }] },
  { id: "misc", titleKey: "faqPage.sections.misc.title", items: [{ q: "faqPage.sections.misc.q1", a: "faqPage.sections.misc.a1" }, { q: "faqPage.sections.misc.q2", a: "faqPage.sections.misc.a2" }] },
];



const FAQ = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string | null>(faqSections[0].id);
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
      titleElement.innerText = t('faqPage.title');
      titleElement.style.fontSize = '24px';
      titleElement.style.marginBottom = '20px';
      titleElement.style.color = '#166534'; // green-800
      tempDiv.appendChild(titleElement);
      
      // Process all FAQ sections
      faqSections.forEach((section, sectionIndex) => {
        const questions = section.items;
        // Add section title
        const sectionElement = document.createElement('h2');
        sectionElement.innerText = t(section.titleKey);
        sectionElement.style.fontSize = '20px';
        sectionElement.style.marginTop = '25px';
        sectionElement.style.marginBottom = '15px';
        sectionElement.style.color = '#166534'; // green-800
        tempDiv.appendChild(sectionElement);
        
        // Add questions and answers
        questions.forEach((item, itemIndex) => {
          // Question
          const questionElement = document.createElement('h3');
          questionElement.innerText = `${itemIndex + 1}. ${t(item.q)}`;
          questionElement.style.fontSize = '16px';
          questionElement.style.fontWeight = 'bold';
          questionElement.style.marginTop = '15px';
          questionElement.style.marginBottom = '8px';
          tempDiv.appendChild(questionElement);
          
          // Answer
          const answerElement = document.createElement('p');
          answerElement.innerText = t(item.a);
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
      alert(t('faqPage.pdfError'));
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
            {t('faqPage.title')}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 font-['Hind_Siliguri']">
            {t('faqPage.subtitle')}
          </p>
          
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            {faqSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors font-['Hind_Siliguri'] ${
                  activeSection === section.id
                    ? 'bg-lime-600 text-white'
                    : 'bg-lime-100 text-green-900 hover:bg-lime-200'
                }`}
              >
                {t(section.titleKey)}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div ref={pdfRef} className="bg-white rounded-lg shadow-md p-6 mt-6">
            {activeSection && (
              <>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-green-900 font-['Hind_Siliguri']">{t(faqSections.find(sec => sec.id === activeSection)!.titleKey)}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqSections.find(sec => sec.id === activeSection)!.items.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-green-900 text-base font-['Hind_Siliguri']">
                        {t(faq.q)}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 font-['Hind_Siliguri']">
                        {t(faq.a)}
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
          {isGeneratingPDF ? t('faqPage.generatingPdf') : t('faqPage.downloadPdf')}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
