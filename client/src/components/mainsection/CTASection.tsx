import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Container } from '../Container';

export const CTASection = () => {
  return (
    <section className="py-12" aria-label="Wito wa kutiketi">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-linear-to-r from-primary to-green-600 text-white text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Uko tayari kusafiri?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nunua tiketi ya basi sasa na furahia safari ya starehe kote
              Tanzania.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/booking">Nunua tiketi sasa</Link>
            </Button>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
};