'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Layout, 
  ListTodo,
  Users, 
  Bell,
  Sparkles
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import FeatureCard from '@/components/FeatureCard';
import HeroImage from '@/components/HeroImage';
import { useSession } from 'next-auth/react';

const LandingPage = () => {
  const navigate = useRouter();

  const {status, data: session} = useSession()
  
  const handleGetStarted = () => {
    if (status == 'authenticated') {
      navigate.push('/dashboard');
    } else {
      navigate.push('/signin');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 px-4 overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/30 via-primary/5 to-background"></div>
        <div className="absolute top-0 left-0 right-0 h-1/2 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/40 via-primary/10 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-5"></div>
        
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <AnimatedSection className="lg:w-1/2 text-center lg:text-left z-10">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Your Personal Project Manager
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Manage Projects with</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">SoloSprint</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
              Streamline your workflow, collaborate seamlessly, and boost productivity with our intuitive task management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate.push('/features')}
                className="border-primary/20 hover:bg-primary/5"
              >
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary w-5 h-5" />
                <span className="text-sm">Free to get started</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary w-5 h-5" />
                <span className="text-sm">No credit card required</span>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="lg:w-1/2 relative" delay={0.2}>
            {/* Glass card effect around the hero image */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl -z-10"></div>
            <motion.div 
              initial={{ y: 10 }}
              animate={{ y: -10 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 3,
                ease: "easeInOut" 
              }}
              className="p-4"
            >
              <HeroImage />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedSection>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
                Why Choose SoloSprint
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your projects effectively and collaborate with your team seamlessly.
              </p>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Layout}
              title="Intuitive Boards"
              description="Organize your tasks visually with customizable boards that adapt to your workflow."
              delay={0.1}
            />
            <FeatureCard
              icon={ListTodo}
              title="Task Management"
              description="Create, assign, and track tasks with deadlines, priorities, and detailed descriptions."
              delay={0.2}
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates, comments, and file sharing."
              delay={0.3}
            />
            <FeatureCard
              icon={Bell}
              title="Notifications"
              description="Stay updated with timely notifications about task changes and deadlines."
              delay={0.4}
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Progress Tracking"
              description="Monitor project progress with visual charts and detailed reports."
              delay={0.5}
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-10 md:p-16 shadow-xl max-w-4xl mx-auto text-center border border-primary/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have transformed their workflow with SoloSprint.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Layout className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">SoloSprint</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SoloSprint. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;