import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Trust } from '@/components/sections/Trust'
import { SuccessStories } from '@/components/sections/SuccessStories'
import { Mission } from '@/components/sections/Mission';
import { Pricing } from '@/components/sections/Pricing';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Feature Section */}
      <Features />

      {/* Trust Section */}
      <Trust />

      <Mission />

      {/* Pricing Section */}
      <Pricing />

      {/* Success Stories Section */}
      {/* <SuccessStories /> */}
    </div>
  );
}