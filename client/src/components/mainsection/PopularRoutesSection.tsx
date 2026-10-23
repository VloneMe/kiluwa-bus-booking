import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PiSeatFill, PiMapPin, PiStarFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { Container } from '../Container';

export const PopularRoutesSection = () => {
  const featuredRoutes = [
    {
      id: 1,
      from: 'Dar es Salaam',
      to: 'Arusha',
      departure: '08:00 AM',
      arrival: '04:00 PM',
      price: 45000,
      seats: 12,
      company: 'Kilimanjaro Express',
      rating: 4.5,
    },
    // Add more routes...
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
          <h2 className="text-3xl font-bold mb-4">Today's Featured Buses</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Popular routes with available seats
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="border-primary/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{route.from}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <PiMapPin className="w-4 h-4" />
                        {route.to}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <PiStarFill className="w-4 h-4 text-yellow-500" />
                      {route.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Departure</p>
                      <p className="font-medium">{route.departure}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Arrival</p>
                      <p className="font-medium">{route.arrival}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <PiSeatFill className="w-5 h-5 text-primary" />
                      <span className="font-medium">{route.seats} seats left</span>
                    </div>
                    <p className="text-lg font-bold">
                      Tsh {route.price.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/booking/${route.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/routes">View All Buses</Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
};