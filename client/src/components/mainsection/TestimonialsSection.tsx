import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { PiStarFill } from 'react-icons/pi';
import { Container } from '../Container';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'John M.',
      comment: 'Easy booking and comfortable ride. Will use again!',
      rating: 5,
    },
    // Add more testimonials...
  ];

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from travelers who've used our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <PiStarFill
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "{testimonial.comment}"
                </p>
                <p className="font-medium">— {testimonial.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};