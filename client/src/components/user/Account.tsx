import { Section } from '../Section';  
import { Container } from '../Container';  
import { Accordions } from './Accordions';  
import { useAuth } from '@/context/AuthProvider';  

export const Account = () => {  
  const { user } = useAuth();  
  return (  
    <Section className='bg-gray-200 lg:min-h-screen w-full flex flex-col'>  
      <div className='flex flex-col justify-between w-full h-full'>  
        <Container className="lg:w-4/12 w-full bg-white h-full px-10 p-5">  
          <div className='shadow-lg border-l border-primary p-4 tracking-wider rounded-lg'>  
            <h1 className='text-xl font-bold'>Habari, <span className='text-primary'>{`${user?.first_name} ${user?.last_name}`}</span></h1>  
            Karibu Kiluwa Luxuary Coach.  
          </div>  

          <div className='px-1'>  
            <Accordions />  
          </div>  
        </Container>  
      </div>  
    </Section>  
  );  
};