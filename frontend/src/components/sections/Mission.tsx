"use client";

import { motion } from "framer-motion";

export function Mission() {
  return (
    <section className="py-16 md:py-24 bg-background-cold overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our{" "}
            <span className="text-primary">Mission</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Empowering Sri Lankans with structured, ethical, and transparent global opportunities to build a better future for themselves and their families.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
