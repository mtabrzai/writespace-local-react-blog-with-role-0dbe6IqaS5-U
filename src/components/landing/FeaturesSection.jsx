import React from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Users, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const features = [
  {
    title: 'Create & Publish',
    description: 'Write your stories and publish them with a single click. Our rich text editor makes formatting effortless.',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    color: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    title: 'Connect with Readers',
    description: 'Build your audience and engage with readers through comments and reactions. Grow your community effortlessly.',
    icon: <Users className="h-8 w-8 text-primary" />,
    color: 'bg-purple-50 dark:bg-purple-900/30',
  },
  {
    title: 'Track Performance',
    description: 'Monitor views, reads, and engagement with built-in analytics. Understand what resonates with your audience.',
    icon: <Eye className="h-8 w-8 text-primary" />,
    color: 'bg-pink-50 dark:bg-pink-900/30',
  },
];

const FeaturesSection = ({ className, ...props }) => {
  return (
    <section className={`py-24 sm:py-32 ${className}`} {...props}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to share your stories
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            A complete platform designed for writers and readers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className={`border-0 shadow-lg ${feature.color}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

FeaturesSection.propTypes = {
  className: PropTypes.string,
};

export { FeaturesSection };