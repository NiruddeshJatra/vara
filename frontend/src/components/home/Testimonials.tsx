
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    location: "New York",
    quote: "I borrowed a pressure washer for my driveway and saved $150 compared to buying one. The owner was super helpful with tips too!",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    id: 2,
    name: "Michael T.",
    location: "San Francisco",
    quote: "Vhara helped me earn $2,000 last year by renting out my camera gear when I wasn't using it. It's passive income for stuff I already own!",
    avatar: "/placeholder.svg",
    rating: 5
  },
  {
    id: 3,
    name: "Priya K.",
    location: "Chicago",
    quote: "I needed a tent for a weekend camping trip. Found one nearby, picked it up in 20 minutes. So much better than buying something I'll rarely use.",
    avatar: "/placeholder.svg",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section relative bg-gradient-to-b from-green-50 to-white">
      {/* Nature-inspired background elements */}
      <div className="absolute inset-0 -z-10 opacity-5 bg-center bg-cover"></div>
      
      <div className="container mx-auto">
        <div className="section-title">
          <h2 className="text-green-800">What Our Users Say</h2>
          <p className="text-green-700/80">Join thousands of people already saving money and earning extra income with Bhara.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4 border-2 border-green-100">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-green-100 text-green-700">{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-lg text-green-800">{testimonial.name}</h4>
                  <p className="text-green-600/80 text-sm">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              
              <p className="italic text-md text-green-700">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
