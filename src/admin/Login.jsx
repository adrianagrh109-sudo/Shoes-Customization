// src/admin/Login.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast({
        title: 'Login Gagal',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang kembali, Admin!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/admin'); // Tendang ke halaman dashboard admin setelah sukses
    }
    setLoading(false);
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="blackAlpha.100" px={4}>
      <Box p={8} maxW="md" w="full" bg="white" rounded="2xl" shadow="2xl" borderWidth={1} borderColor="gray.200">
        <Stack spacing={4}>
          <Box textAlign="center" mb={2}>
            <Heading size="lg" fontWeight="bold">SoleCraft Admin</Heading>
            <Text color="gray.500" mt={2} fontSize="sm">Silakan masuk untuk mengelola pesanan</Text>
          </Box>
          
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">Email Admin</FormLabel>
                <Input 
                  type="email" 
                  focusBorderColor="black" 
                  rounded="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@solecraft.com"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">Password</FormLabel>
                <Input 
                  type="password" 
                  focusBorderColor="black" 
                  rounded="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blackAlpha"
                bg="black"
                color="white"
                _hover={{ bg: 'gray.800' }}
                size="lg"
                fontSize="md"
                rounded="lg"
                isLoading={loading}
                mt={2}
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
}