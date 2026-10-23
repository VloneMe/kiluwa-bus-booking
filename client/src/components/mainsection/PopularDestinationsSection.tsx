import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Container } from '../Container';

export const PopularDestinationsSection = () => {
  const popularDestinations = [
    { id: 1, name: 'Arusha', image: '/arusha.jpg' },
    { id: 2, name: 'Dodoma', image: '/dodoma.jpg' },
    { id: 3, name: 'Mwanza', image: '/mwanza.jpg' },
    { id: 4, name: 'Mbeya', image: '/mbeya.jpg' },
  ];

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
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore Tanzania's most visited cities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="relative overflow-hidden h-64 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-20 h-full flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">
                    {destination.name}
                  </h3>
                  <Button
                    variant="ghost"
                    className="w-fit mt-2 text-white hover:text-white hover:bg-white/20"
                    asChild
                  >
                    <Link to={`/routes?to=${destination.name}`}>
                      View Buses
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};