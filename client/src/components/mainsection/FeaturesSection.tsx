import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { PiBus, PiClock, PiSeatFill } from 'react-icons/pi';
import { Container } from '../Container';

export const FeaturesSection = () => {
  return (
    <section className="py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide the best bus booking experience with these key features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <PiBus className="w-8 h-8" />,
              title: "Wide Network",
              description: "Access to buses across all major routes in Tanzania",
            },
            {
              icon: <PiClock className="w-8 h-8" />,
              title: "Instant Booking",
              description: "Book your seat instantly with secure payment",
            },
            {
              icon: <PiSeatFill className="w-8 h-8" />,
              title: "Seat Selection",
              description: "Choose your preferred seat when booking",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full text-center p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};