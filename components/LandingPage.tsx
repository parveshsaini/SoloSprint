
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
  Bell
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
      <section className="relative py-20 px-4 md:py-32 overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <AnimatedSection className="lg:w-1/2 text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span className="block">Manage Projects with</span>
              <span className="text-primary">TaskFlow</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
              Streamline your workflow, collaborate seamlessly, and boost productivity with our intuitive task management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate.push('/features')}
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
          
          <AnimatedSection className="lg:w-1/2" delay={0.2}>
            <HeroImage />
          </AnimatedSection>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
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
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card border border-border/60 rounded-xl p-8 md:p-12 shadow-sm max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have transformed their workflow with TaskFlow.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="gap-2"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Layout className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">TaskFlow</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;