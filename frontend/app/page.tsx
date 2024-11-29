"use client"

import React from 'react';
import Image from "next/image";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Chip
} from "@nextui-org/react";
import {
  FaWhatsapp,
  FaDiscord,
  FaShieldAlt,
  FaUsers,
  FaEnvelope,
  FaRocket,
  FaLock,
  FaBell,
  FaTelegramPlane
} from 'react-icons/fa';
import { SiRoblox } from 'react-icons/si';
import logoImage from "@/assets/logo.webp";

const platforms = [
  {
    name: "WhatsApp",
    description: "Monitor group chats while preserving privacy",
    status: "Available Now",
    icon: <FaWhatsapp className="h-8 w-8 mb-2 text-green-500" />
  },
  {
    name: "Discord",
    description: "Keep track of server activities and conversations",
    status: "Coming Soon",
    icon: <FaDiscord className="h-8 w-8 mb-2 text-indigo-500" />
  },
  {
    name: "Telegram",
    description: "Securely monitor group and individual chats while maintaining user privacy",
    status: "Coming Soon",
    icon: <FaTelegramPlane className="h-8 w-8 mb-2 text-blue-500" />
  },
  {
    name: "Roblox",
    description: "Monitor in-game chat for player safety and compliance.",
    status: "In Development",
    icon: <SiRoblox className="h-8 w-8 mb-2 text-red-500" />
  }
];

const features = [
  {
    title: "AI-Powered Monitoring",
    description: "Advanced AI technology that understands context and sentiment",
    icon: <FaShieldAlt className="h-6 w-6" />
  },
  {
    title: "Privacy First",
    description: "Secure, consent-based monitoring that respects personal boundaries",
    icon: <FaLock className="h-6 w-6" />
  },
  {
    title: "Real-time Alerts",
    description: "Get instant notifications about concerning interactions",
    icon: <FaBell className="h-6 w-6" />
  },
  {
    title: "Community Support",
    description: "Join a community of parents committed to digital safety",
    icon: <FaUsers className="h-6 w-6" />
  }
];

const frequentlyQuestions = [
  {
    q: "How does Vigilant Owl monitor group chats without invading privacy?",
    a: "Vigilant Owl uses AI to assess the general tone of group conversations without reading specific messages. This approach keeps your child's privacy intact while offering insights into their online interactions."
  },
  {
    q: "What should I do if I'm interested in Vigilant Owl?",
    a: "Simply fill out the contact form below and provide your email address. We'll keep you updated on the latest developments, share exclusive insights, and offer early access to Vigilant Owl as we prepare for launch."
  },
  {
    q: "Which platforms are supported?",
    a: "Currently, Vigilant Owl supports WhatsApp, with plans to expand to other popular messaging and social media platforms."
  },
  {
    q: "How is my data protected?",
    a: "Vigilant Owl adheres to strict data security protocols, ensuring any collected information remains private and secure."
  },
  {
    q: "Is Vigilant Owl difficult to set up?",
    a: "No, Vigilant Owl is simple to set up. Parents add a designated bot to group chats, and the AI does the rest, providing easy-to-understand summaries."
  }
];

const Page = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-4">
          <Chip
            color="secondary"
            variant="shadow"
            startContent={<FaRocket className="h-4 w-4" />}
          >
            Coming Soon
          </Chip>
        </div>
        <h1 className="text-4xl font-bold mb-4">Vigilant Owl</h1>
        <h2 className="text-2xl text-default-500 mb-8">
          Stay Informed, Stay Supportive: AI-Driven Group Chat Monitoring for Parents
        </h2>
        <div className="flex justify-center mb-8">
          <Image
            src={logoImage}
            width={300}
            height={330}
            alt="logo"
            className="rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* Platforms Section */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Supported Platforms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card key={platform.name} isHoverable>
              <CardBody className="text-center">
                <div className="flex justify-center">{platform.icon}</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-200">{platform.name}</h4>
                <p className="text-default-500 mb-4">{platform.description}</p>
                <Chip
                  color={
                    platform.status === 'Available Now' ? 'success' :
                      platform.status === 'Coming Soon' ? 'warning' : 'default'
                  }
                  variant="flat"
                >
                  {platform.status}
                </Chip>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Our Story</h3>
        <Card isHoverable>
          <CardBody>
            <p className="text-lg leading-relaxed text-gray-300 px-2">
              {`As a parent, I often worry about what happens in my kids' online group chats.
              I want to balance their independence with safety, yet fully banning social media
              is unrealistic—and parent's busy schedules make constant monitoring difficult.
              I remember a time when family members, like aunts or older sisters would
              chaperone children and teens to places like the movies, offering a watchful
              eye from a respectful distance. This inspired Vigilant Owl: a modern,
              AI-powered chaperone that gives insights while letting kids grow with independence.`}
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} isHoverable>
              <CardBody>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold ml-3 text-gray-200">{feature.title}</h4>
                </div>
                <p className="text-gray-300">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {frequentlyQuestions.map((faq, index) => (
            <Card key={index} isHoverable>
              <CardBody>
                <h4 className="font-bold mb-2 text-gray-300">{faq.q}</h4>
                <p className="text-default-500">{faq.a}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Contact Us</h3>
        <Card className="max-w-2xl mx-auto" isHoverable>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  variant="bordered"
                  startContent={<FaUsers className="text-default-400 pointer-events-none flex-shrink-0" />}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  variant="bordered"
                  startContent={<FaUsers className="text-default-400 pointer-events-none flex-shrink-0" />}
                />
              </div>
              <Input
                type="email"
                label="Email"
                placeholder="john@example.com"
                variant="bordered"
                startContent={<FaEnvelope className="text-gray-400 pointer-events-none flex-shrink-0" />}
              />
              <Textarea
                label="Message"
                placeholder="Your message..."
                variant="bordered"
                minRows={4}
              />
              <Button
                color="secondary"
                type="submit"
                className="w-full"
                startContent={<FaEnvelope className="h-4 w-4" />}
              >
                Send Message
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
};

export default Page;