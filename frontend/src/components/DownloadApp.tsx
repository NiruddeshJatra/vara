
import { Button } from '@/components/ui/button';

const DownloadApp = () => {
  return (
    <section className="section bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-up md:pr-8">
            <span className="inline-block text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6">Mobile App</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Take Vhara Everywhere You Go</h2>
            <p className="text-muted-foreground mb-8">
              Download our mobile app to manage your rentals, receive instant notifications, and access items on the go. Get the full Vhara experience in the palm of your hand.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="inline-flex items-center bg-black text-white hover:bg-black/90">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5227 19.2278C17.2914 19.686 16.9758 20.1067 16.5856 20.4865C16.1955 20.8663 15.7985 21.151 15.3947 21.3404C14.9908 21.5299 14.5414 21.6247 14.0465 21.6247C13.3889 21.6247 12.8145 21.4769 12.323 21.1814C11.8318 20.8856 11.4445 20.4927 11.1607 20H12.844C13.0231 20.2089 13.2523 20.3686 13.5321 20.4794C13.8122 20.5904 14.1208 20.6458 14.4583 20.6458C14.8767 20.6458 15.2555 20.5463 15.5952 20.3473C15.9349 20.1484 16.2067 19.8831 16.4105 19.5518C16.6144 19.2204 16.7163 18.856 16.7163 18.4583C16.7163 18.0607 16.6144 17.6924 16.4105 17.3537C16.2067 17.0148 15.9349 16.7463 15.5952 16.5473C15.2555 16.3484 14.8767 16.2488 14.4583 16.2488C14.1251 16.2488 13.8188 16.3083 13.5394 16.4274C13.2598 16.5463 13.0315 16.7161 12.8543 16.9366H11.1607C11.4472 16.4439 11.8374 16.05 12.3317 15.7552C12.8259 15.4605 13.3974 15.3131 14.0465 15.3131C14.5414 15.3131 14.9908 15.4079 15.3947 15.5973C15.7985 15.7868 16.1955 16.0715 16.5856 16.4513C16.9758 16.8311 17.2914 17.2518 17.5227 17.71C17.7741 18.2278 17.9 18.7748 17.9 19.3689C17.9 19.964 17.7741 20.51 17.5227 20.2278ZM12.8283 10.0071V7.58629L8.02466 15.3131H6.5L11.2283 7.58629H8.73071V6.65051H12.8283V10.0071ZM13.46 9.24512V8.37091H19.04V9.24512H13.46ZM8.73071 4.63051V3.69471H12.8283V4.63051H8.73071Z" fill="currentColor" />
                </svg>
                Download on the<br/>App Store
              </Button>
              <Button className="inline-flex items-center bg-black text-white hover:bg-black/90">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5227 19.2278C17.2914 19.686 16.9758 20.1067 16.5856 20.4865C16.1955 20.8663 15.7985 21.151 15.3947 21.3404C14.9908 21.5299 14.5414 21.6247 14.0465 21.6247C13.3889 21.6247 12.8145 21.4769 12.323 21.1814C11.8318 20.8856 11.4445 20.4927 11.1607 20H12.844C13.0231 20.2089 13.2523 20.3686 13.5321 20.4794C13.8122 20.5904 14.1208 20.6458 14.4583 20.6458C14.8767 20.6458 15.2555 20.5463 15.5952 20.3473C15.9349 20.1484 16.2067 19.8831 16.4105 19.5518C16.6144 19.2204 16.7163 18.856 16.7163 18.4583C16.7163 18.0607 16.6144 17.6924 16.4105 17.3537C16.2067 17.0148 15.9349 16.7463 15.5952 16.5473C15.2555 16.3484 14.8767 16.2488 14.4583 16.2488C14.1251 16.2488 13.8188 16.3083 13.5394 16.4274C13.2598 16.5463 13.0315 16.7161 12.8543 16.9366H11.1607C11.4472 16.4439 11.8374 16.05 12.3317 15.7552C12.8259 15.4605 13.3974 15.3131 14.0465 15.3131C14.5414 15.3131 14.9908 15.4079 15.3947 15.5973C15.7985 15.7868 16.1955 16.0715 16.5856 16.4513C16.9758 16.8311 17.2914 17.2518 17.5227 17.71C17.7741 18.2278 17.9 18.7748 17.9 19.3689C17.9 19.964 17.7741 20.51 17.5227 20.2278ZM12.8283 10.0071V7.58629L8.02466 15.3131H6.5L11.2283 7.58629H8.73071V6.65051H12.8283V10.0071ZM13.46 9.24512V8.37091H19.04V9.24512H13.46ZM8.73071 4.63051V3.69471H12.8283V4.63051H8.73071Z" fill="currentColor" />
                </svg>
                Get it on<br/>Google Play
              </Button>
            </div>
            
            {/* App Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time Notifications</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Seamless Messaging</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Item Scanning</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Location Services</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image/Mockup */}
          <div className="relative flex justify-center items-center animate-slide-in-right">
            <div className="absolute w-64 h-64 bg-primary/5 rounded-full -z-10"></div>
            <div className="relative w-full max-w-xs">
              <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1605170439002-90845e8c0137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Vhara Mobile App" 
                  className="w-full"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/4 -right-8 w-12 h-12 bg-vhara-200 rounded-full opacity-70"></div>
              <div className="absolute bottom-1/4 -left-8 w-16 h-16 bg-vhara-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
