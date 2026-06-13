// src/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser'; // <-- 1. Import EmailJS
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Select,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

const statusColorScheme = {
  pending: 'yellow',
  'In Production': 'blue',
  Done: 'green',
};

export default function AdminDashboard() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchPesanan();
  }, []);

  async function fetchPesanan() {
    setLoading(true);
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Gagal memuat data',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setPesanan([]);
    } else {
      setPesanan(data || []);
    }

    setLoading(false);
  }

  // <-- 2. Fungsi Otomatisasi EmailJS
  async function kirimEmailStatus(customerName, customerEmail, statusBaru) {
    // Teks deskripsi progress custom biar emailnya estetik dan komunikatif
    let deskripsiProgress = "Pesanan Anda saat ini sedang masuk dalam antrean pengecekan tim desain kami.";
    if (statusBaru === 'In Production') {
      deskripsiProgress = "Sepatu kustom Anda sudah mulai masuk meja produksi! Tim artisan kami sedang merakit dan mewarnai sepatu Anda dengan penuh ketelitian.";
    } else if (statusBaru === 'Done') {
      deskripsiProgress = "Kabar gembira! Sepatu kustom Anda sudah selesai diproduksi, lolos quality control, dan siap untuk dikirimkan ke alamat Anda.";
    }

    const templateParams = {
      customer_name: customerName,
      customer_email: customerEmail,
      status_baru: statusBaru,
      deskripsi_progress: deskripsiProgress,
    };

    try {
      // GANTI string kosong di bawah ini dengan ID dari dashboard EmailJS lu
      await emailjs.send(
       import.meta.env.VITE_EMAILJS_SERVICE_ID,
       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
       templateParams,
       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
      console.log('Email status berhasil dikirim via EmailJS!');
    } catch (err) {
      console.error('EmailJS Error:', err);
      toast({
        title: 'Email Gagal Dikirim',
        description: 'Status di database terupdate, tapi email notifikasi gagal terkirim.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }
  }

  async function updateStatus(id, statusBaru) {
    // Ambil data customer yang mau di-update buat dapetin nama & emailnya
    const customer = pesanan.find((p) => p.id === id);
    if (!customer) return;

    const { error } = await supabase
      .from('designs')
      .update({ status_pesanan: statusBaru })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Gagal update status',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      // 1. Update State Lokal di UI
      setPesanan((prev) => prev.map((p) => (p.id === id ? { ...p, status_pesanan: statusBaru } : p)));
      
      toast({
        title: 'Status diperbarui',
        description: `Pesanan berhasil diubah menjadi ${statusBaru}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // 2. Pemicu Pengiriman Email Notifikasi
      if (customer.customer_email) {
        kirimEmailStatus(customer.customer_name, customer.customer_email, statusBaru);
      }
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>
              SoleCraft Admin
            </Heading>
            <Text color="gray.600">Kelola status pesanan, tinjau detail pelanggan, dan update progress produksi.</Text>
          </Box>

          <Button
            leftIcon={<Icon as={RepeatIcon} />}
            colorScheme="blackAlpha"
            variant="solid"
            onClick={fetchPesanan}
            minW="150px"
          >
            Refresh Data
          </Button>
        </Flex>

        <Box bg="white" rounded="2xl" shadow="sm" borderWidth={1} borderColor="gray.200" overflowX="auto">
          {loading ? (
            <Center py={16}>
              <Stack direction="row" align="center" spacing={3}>
                <Spinner size="lg" color="black" />
                <Text fontSize="md" color="gray.600">
                  Memuat data pesanan...
                </Text>
              </Stack>
            </Center>
          ) : pesanan.length === 0 ? (
            <Center py={16}>
              <Stack spacing={2} align="center">
                <Heading size="md">Belum ada pesanan masuk</Heading>
                <Text color="gray.500">Coba klik refresh jika ada pesanan baru atau pastikan tabel Supabase sudah berisi data.</Text>
              </Stack>
            </Center>
          ) : (
            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Customer</Th>
                  <Th>Kontak</Th>
                  <Th>Status Saat Ini</Th>
                  <Th textAlign="center">Ubah Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pesanan.map((p) => (
                  <Tr key={p.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="semibold">{p.customer_name || '-'}</Td>
                    <Td>
                      <Text>{p.customer_email || '-'}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {p.customer_phone || 'Tidak ada nomor'}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={statusColorScheme[p.status_pesanan || 'pending']} variant="subtle" px={3} py={1} fontSize="xs" rounded="full">
                        {p.status_pesanan || 'pending'}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <Select
                        maxW="220px"
                        value={p.status_pesanan || 'pending'}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        bg="gray.50"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="In Production">🛠️ In Production</option>
                        <option value="Done">🎉 Done</option>
                      </Select>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>
    </Box>
  );
}