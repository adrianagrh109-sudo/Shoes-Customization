import { useContext, useState, useEffect } from "react";
import { CustomizationContext } from "../context/CustomizationContex.jsx";
import { Button, Box, Heading, Text, Stack, Flex, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import CustomColorPicker from "./CustomColorPicker.jsx";
import SizeCustomizer from "./SizeCustomizer.jsx";
import { supabase } from "../lib/supabase.js";
import { Input, Textarea } from "@chakra-ui/react";

export default function CustomizationInterface() {
  const { isOpenModal, customization, setIsOpenModal } = useContext(CustomizationContext);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const saveDesign = async () => {
      if (
    !customerName ||
    !customerEmail ||
    !customerPhone
     ) {
    alert("Lengkapi data customer terlebih dahulu");
    return;
  }

  const { error } = await supabase
    .from("designs")
    .insert([
         {
        Customer_Name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: notes,
        design_data: customization,
        status: "Pending"
      }
    ]);

  if (error) {
    console.error(error);
    alert("Gagal menyimpan design");
  } else {
    alert("Pesanan berhasil dikirim!");
  }
};
  const heightSideBar = window.innerHeight > 909 ? "auto" : "80vh";
  const overflowYSideBar = window.innerHeight > 909 ? "hidden" : "scroll";

  return (
    <Box style={{ position: "absolute", top: 0, right: "1%" }} p={3} ml={3} width="310px">
      <Box className="headingGlass" mb={4} p={4}>
        <Flex justify="space-between">
          <Text p={2}>Shoe Configurator</Text>
          {isOpenModal ? (
            <IconButton
              variant="outline"
              colorScheme="whiteAlpha"
              aria-label="Collapse menu"
              onClick={() => setIsOpenModal(!isOpenModal)}
              icon={<ChevronUpIcon />}
            />
          ) : null}
        </Flex>
        <Heading as="h1" size="lg" p={2} style={{ fontFamily: "Noto Sans Mono" }}>
          {customization.layerName ? customization.layerName : "Click on a layer to start editing!"}
        </Heading>
      </Box>
      <AnimatePresence>
        {isOpenModal ? (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: heightSideBar, overflowY: overflowYSideBar, overflowX: "hidden" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <Stack spacing={4}>
              <Stack className="glass" p={8} width="290px" spacing="12px">
                <Heading as="h3" size="sm" py={2}>
                  Layer color
                </Heading>
                <CustomColorPicker />
              </Stack>
                <Stack p={8} width="290px">
  <Heading size="sm" color="black.400">
    Customer Information
  </Heading >
  
  <Input 
    bg="white" 
    color="black !important"
    opacity={1} 
    placeholder="Nama"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}/>

  <Input 
    bg="white" 
    color="black !important"
    opacity={1} 
    placeholder="Email"
    value={customerEmail}
    onChange={(e) => setCustomerEmail(e.target.value)}/>

  <Input 
    bg="white" 
    color="black !important"
    opacity={1} 
    placeholder="Nomor HP"
    value={customerPhone}
    onChange={(e) => setCustomerPhone(e.target.value)}/>

  <Textarea 
    bg="white" color="black !important"
    opacity={1} 
    placeholder="Catatan tambahan"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}/>

</Stack>
              <Stack className="glass" p={8} width="290px" spacing="12px">
                <Heading as="h3" size="sm" py={2}>
                  Layer size
                </Heading>
                <SizeCustomizer />
              <Button
               colorScheme="blue" isLoading={loading} onClick={saveDesign}
              >
  Submit Order
</Button>
              </Stack>
            </Stack>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}
