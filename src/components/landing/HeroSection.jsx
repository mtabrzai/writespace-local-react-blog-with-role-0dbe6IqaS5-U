import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/constants';
import { FileText, ArrowRight } from 'lucide-react';

const HeroSection = ({ className, ...props }) => {
  return (
    <section
      className={`relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-2xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-2xl opacity-20 transform translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-48">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{APP_NAME}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Write. Share. Inspire.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            A modern platform for writers to create, publish, and connect with readers worldwide.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <a href="/posts">
                  Explore Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <a href="/login">
                  Get Started
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  className: PropTypes.string,
};

export { HeroSection };