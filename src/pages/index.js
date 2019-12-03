import { useState, useCallback, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";

import {
  Flex,
  Text,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Box,
  IconButton,
  Editable,
  EditablePreview,
  EditableInput,
  Badge,
  CloseButton,
  List,
  ListItem,
  useColorMode,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Avatar,
  Link,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon
} from "@chakra-ui/core";
import { css } from "@emotion/core";
import createPersistedState from "use-persisted-state";
import { FiEdit3, FiTwitter, FiCoffee } from "react-icons/fi";
import { format } from "number-currency-format";
import { NextSeo } from "next-seo";

import * as gtag from "../utils/gtag";

const usePreDiscountState = createPersistedState("prediscount");
const useProvidersState = createPersistedState("providers");
const useDiscountState = createPersistedState("discount");

const RANDOM_NAMES = [
  "AVA",
  "IVI",
  "UVU",
  "EVE",
  "ONO",
  "Ga-Pay",
  "No-Pay",
  "Lo-Pay",
  "Go-vo",
  "Nana",
  "PayAja",
  "NeverPay",
  "Baby-Pay",
  "Shark-Pay",
  "SKYNET-Pay",
  "TemanBayar",
  "UangAjaib"
];

const ProviderCard = ({
  name,
  discountPercentage,
  maxDiscountAmount,
  updateProvider,
  onClose,
  isCheapest,
  preDiscount
}) => {
  const [currentInputName, setCurrentInputName] = useState(name);
  const { colorMode } = useColorMode();
  const onChangeName = value => {
    setCurrentInputName(value);
  };
  const onSubmitName = () => {
    updateProvider({ name: currentInputName });
  };
  const onChangeMaxDiscount = raw => {
    const value = parseInt(raw);
    updateProvider({
      maxDiscountAmount: value ? value : 0
    });
  };
  const onChangeDiscountPercentage = raw => {
    const value = parseInt(raw);
    updateProvider({
      discountPercentage: value ? Math.min(value, 100) : 0
    });
  };
  return (
    <Stack
      m={2}
      p={4}
      boxShadow={
        colorMode === "light"
          ? `0 ${isCheapest ? "8px" : "4px"} 32px 32px ${
              isCheapest ? "rgba(28, 69, 50, 0.1)" : "rgba(64,64,64,0.05)"
            }`
          : "none"
      }
      borderRadius={8}
      width="12rem"
      minHeight="12rem"
      alignItems="center"
      justifyContent="space-between"
      bg={
        colorMode === "light" ? (isCheapest ? "green.50" : "white") : "gray.900"
      }
      position="relative"
      transition="all ease-in-out 0.2s"
      top={isCheapest ? "-8px" : "0"}
      color={colorMode === "light" ? "black" : "gray.50"}
      borderColor={
        colorMode === "light"
          ? "transparent"
          : isCheapest
          ? "green.400"
          : "white"
      }
      borderStyle="solid"
      borderWidth="1px"
    >
      <CloseButton onClick={onClose} alignSelf="flex-start" />
      <Editable
        placeholder="Ganti nama"
        value={name}
        onChange={onChangeName}
        onSubmit={onSubmitName}
        mt="-40px"
        height="32px"
      >
        <EditablePreview
          textAlign="center"
          as="h2"
          fontSize="md"
          fontWeight="bold"
          verticalAlign="middle"
        />
        <EditableInput textAlign="center" value={currentInputName} />
      </Editable>

      <Editable
        placeholder="Ganti besar diskon"
        value={discountPercentage}
        onChange={onChangeDiscountPercentage}
      >
        <EditablePreview
          textAlign="center"
          as="h3"
          fontSize="5xl"
          fontWeight="bold"
          css={css`
            &:after {
              opacity: 0.25;
              content: "%";
            }
          `}
        />
        <EditableInput textAlign="center" />
      </Editable>
      <Badge variantColor={isCheapest ? "green" : "gray"}>
        {Math.min(
          maxDiscountAmount,
          Math.round((discountPercentage * preDiscount) / 100)
        )}
      </Badge>
      <Editable
        value={maxDiscountAmount}
        onChange={onChangeMaxDiscount}
        placeholder="Ganti diskon maksimal"
      >
        <EditablePreview
          fontSize="sm"
          fontWeight="bold"
          css={css`
            &:before {
              font-weight: normal;
              opacity: 0.5;
              content: "maks. ";
            }
          `}
        />
        <EditableInput textAlign="center" />
      </Editable>

      <Text fontSize="0.5rem" fontWeight="bold" opacity="0.5">
        (tekan nama/angka untuk edit)
      </Text>
    </Stack>
  );
};

const AddProviderButton = ({ onClick }) => {
  const { colorMode } = useColorMode();
  const borderColor = { light: "gray.500", dark: "gray.50" };
  const color = { light: "black", dark: "gray.50" };
  const variant = { light: "solid", dark: "ghost" };
  return (
    <Flex
      flexDirection="column"
      border="dashed 1px"
      borderColor={borderColor[colorMode]}
      minWidth="12rem"
      minHeight="12rem"
      borderRadius={8}
      alignItems="center"
      justifyContent="center"
      mx={2}
      color={color[colorMode]}
    >
      <IconButton
        variant={variant[colorMode]}
        aria-label="Tambah provider"
        icon="add"
        onClick={onClick}
      />
      <Text textAlign="center" mt={2}>
        Tambah provider
      </Text>
    </Flex>
  );
};

const SEO = () => (
  <NextSeo
    title="Cashbacc"
    description="He attacc, he protecc, but most importantly, he calculate cashbacc"
    canonical="https://cashba.cc/"
    openGraph={{
      url: "https://cashba.cc",
      title: "Cashbacc",
      description:
        "He attacc, he protecc, but most importantly, he calculate cashbacc",
      images: [
        {
          url: "https://cashba.cc/image/og.png"
        }
      ],
      site_name: "CashBacc"
    }}
    twitter={{
      handle: "@mathdroid",
      site: "@mathdroid",
      cardType: "summary_large_image"
    }}
  />
);

const INITIAL_PRE_DISCOUNT = 0;
const INITIAL_PROVIDERS = [];
const INITIAL_MAX_AMOUNT = { amount: 0, index: -1 };

const useMaxDiscountAmount = (
  initialPreDiscount = INITIAL_PRE_DISCOUNT,
  initialProviders = INITIAL_PROVIDERS
) => {
  const [preDiscount, setPreDiscount] = usePreDiscountState(initialPreDiscount);
  const [providers, setProviders] = useProvidersState(initialProviders);

  const getDiscountAmount = useCallback(
    ({ discountPercentage, maxDiscountAmount }) => {
      return Math.min(
        maxDiscountAmount,
        Math.round((discountPercentage * preDiscount) / 100)
      );
    },
    [preDiscount]
  );

  const maxDiscountAmountReducer = (prev, cur, index) => {
    const currentDiscountAmount = getDiscountAmount(cur);
    const isHigherThanPrevious = currentDiscountAmount > prev.amount;
    return isHigherThanPrevious
      ? {
          amount: currentDiscountAmount,
          index
        }
      : prev;
  };

  const [{ amount, index }, setMaxDiscountAmount] = useDiscountState(() => {
    return providers.reduce(maxDiscountAmountReducer, INITIAL_MAX_AMOUNT);
  });

  useEffect(() => {
    const newMaxDiscountAmount = providers.reduce(
      maxDiscountAmountReducer,
      INITIAL_MAX_AMOUNT
    );
    setMaxDiscountAmount(newMaxDiscountAmount);
  }, [providers, preDiscount]);

  const addNewProvider = useCallback(() => {
    const isNameExist = n => providers.some(p => p.name === n);
    const getNewName = (run = 0) => {
      const newName =
        RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const backupName = `${newName}${run}`;
      return !isNameExist(newName)
        ? newName
        : !isNameExist(backupName)
        ? backupName
        : getNewName(run + 1);
    };
    const newProvider = {
      name: getNewName(),
      discountPercentage: (Math.round(Math.random() * 19) + 1) * 5,
      maxDiscountAmount: (Math.round(Math.random() * 19) + 1) * 2500
    };
    setProviders([...providers, newProvider]);
  }, [providers]);

  const updateProvider = i => newProvider => {
    const newProviders = providers.map((p, ii) => {
      if (i !== ii) {
        return p;
      }
      return {
        ...p,
        ...newProvider
      };
    });
    setProviders(newProviders);
  };

  const removeProvider = useCallback(
    i => {
      setProviders([...providers.slice(0, i), ...providers.slice(i + 1)]);
    },
    [providers]
  );

  return {
    amount,
    index,
    preDiscount,
    setPreDiscount,
    providers,
    addNewProvider,
    updateProvider,
    removeProvider
  };
};

export default () => {
  const {
    amount,
    index,
    preDiscount,
    setPreDiscount,
    providers,
    addNewProvider,
    updateProvider,
    removeProvider
  } = useMaxDiscountAmount();

  const [user, initialising, error] = useAuthState(firebase.auth());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shouldShowOtpInput, setShouldShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [confirmationResult, setConfirmationResult] = useState({});

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onClose: onCloseLoginModal
  } = useDisclosure();

  const onChangePreDiscount = raw => {
    const value = parseInt(raw, 10);
    setPreDiscount(() => (value ? value : 0));
  };

  const toggleOtpInput = () => setShouldShowOtpInput(!shouldShowOtpInput);

  const handlePhoneNumberChange = e => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpValueChange = e => {
    setOtpValue(e.target.value);
  };

  const login = () => {
    if (typeof document !== "undefined") {
      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "login-button",
        {
          size: "invisible"
        }
      );
      firebase
        .auth()
        .signInWithPhoneNumber(`+62${phoneNumber}`, applicationVerifier)
        .then(async confirmationResult => {
          toggleOtpInput();
          setConfirmationResult(confirmationResult);
        })
        .catch(error => {
          console.error({ error });
        });
    }
  };

  const logout = () => {
    firebase.auth().signOut();
    setShouldShowOtpInput(false);
    setConfirmationResult({});
    setOtpValue("");
    setPhoneNumber("");
  };

  const confirmOtp = () => {
    if (confirmationResult.confirm) {
      confirmationResult.confirm(otpValue);
    }
  };

  return (
    <>
      <SEO />
      <Flex
        minHeight="100vh"
        width="100%"
        flexDirection="row"
        justifyContent="center"
        bg={colorMode === "light" ? "gray.100" : "gray.800"}
      >
        <Flex
          as="header"
          width="32rem"
          maxWidth="100vw"
          position="fixed"
          top="0"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <IconButton
            aria-label="Ganti mode warna"
            icon={colorMode === "light" ? "moon" : "sun"}
            variant="ghost"
            onClick={() => {
              toggleColorMode();
              gtag.event({
                action: "toggle_color_mode"
              });
            }}
          />
          <IconButton
            aria-label="Informasi"
            icon="info-outline"
            variant="ghost"
            onClick={() => {
              onOpen();
              gtag.event({
                action: "open_modal"
              });
            }}
          />

          <IconButton
            aria-label="Log In"
            icon="unlock"
            variant="ghost"
            onClick={() => {
              onOpenLoginModal();
            }}
          />
        </Flex>
        <Modal isOpen={isOpenLoginModal} onClose={onCloseLoginModal}>
          <ModalOverlay />
          <ModalContent color={colorMode === "light" ? "black" : "gray.50"}>
            <ModalHeader>Log In</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column">
              {initialising ? (
                <Text>Initialising User...</Text>
              ) : error ? (
                <Text>Error: {error}</Text>
              ) : user ? (
                <>
                  <Text>Current User: {user.uid}</Text>
                  <Button onClick={logout}>Log out</Button>
                </>
              ) : (
                <>
                 <InputGroup>
    <InputLeftAddon children="+62" />
    <Input type="phone" roundedLeft="0" placeholder="phone number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange} />
  </InputGroup>
                  {shouldShowOtpInput && (
                    <Input
                      placeholder="OTP"
                      value={otpValue}
                      onChange={handleOtpValueChange}
                    />
                  )}
                  <Button
                    onClick={shouldShowOtpInput ? confirmOtp : login}
                    id="login-button"
                  >
                    {shouldShowOtpInput ? "confirm OTP" : "log in"}
                  </Button>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent color={colorMode === "light" ? "black" : "gray.50"}>
            <ModalHeader>Cashbacc App</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column">
              <Text fontWeight="bold" mb="1rem">
                Terimakasih untuk menggunakan Cashbacc!
              </Text>
              <Text>
                Saya membuat Cashbacc karena banyaknya promosi cashback dari
                berbagai merk pembayaran elektronik dengan jumlah total yang
                agak membingungkan 😅 40% dengan maks 10000, 25% maks 12500,
                dll.
              </Text>

              <Text mt={2}>
                Dengan aplikasi ini kita dapat membandingkan berbagai promo
                tersebut dan mendapatkan jumlah promosi terbesar, tanpa
                repot-repot menghitung 😇
              </Text>

              <Text mt={2}>
                Semoga alat ini bisa membantu.{" "}
                <Link
                  href="https://github.com/mathdroid/cashbacc"
                  isExternal
                  mr={2}
                >
                  Kode Sumber <Icon name="external-link" ml="2px" />
                </Link>{" "}
                dapat dilihat di tautan. Apabila ada saran/keluhan, saya bisa
                dihubungi di{" "}
                <Link href="https://twitter.com/mathdroid" isExternal>
                  sini <Icon name="external-link" mx="2px" />
                </Link>
                .
              </Text>

              <Text mt={2}>Ttd,</Text>
              <Text mt={4} fontWeight="bold">
                mathdroid
              </Text>
              <Avatar
                alignSelf="flex-end"
                size="xl"
                name="Muhammad Mustadi"
                src="/image/photo.jpg"
              />
            </ModalBody>

            <ModalFooter>
              <Flex flexDirection="row" alignItems="center">
                <Button
                  leftIcon={FiCoffee}
                  variant="outline"
                  mr={2}
                  onClick={() => {
                    gtag.event({
                      action: "add_to_cart"
                    });
                  }}
                >
                  <Link href="https://karyakarsa.com/mathdroid">Donasi</Link>
                </Button>
                <Button
                  leftIcon={FiTwitter}
                  variant="outline"
                  mr={2}
                  onClick={() => {
                    gtag.event({
                      action: "share"
                    });
                  }}
                >
                  <Link href="https://twitter.com/intent/tweet?text=He attacc, he protecc, but most importantly, he calculate cashbacc&url=https://cashba.cc&via=mathdroid">
                    Tweet
                  </Link>
                </Button>
                <Button variantColor="gray" onClick={onClose}>
                  Tutup
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Flex
          as="main"
          maxWidth="100vw"
          width="32rem"
          flexDirection="column"
          bg={colorMode === "light" ? "white" : "gray.900"}
          border="black.400"
          boxShadow={
            colorMode === "light" ? "0 0 16px 16px rgba(64,64,64,0.1)" : "none"
          }
        >
          <Flex
            as="section"
            alignItems="center"
            justifyContent="center"
            minHeight="40vh"
            background={
              colorMode === "light"
                ? "radial-gradient(circle at bottom, #f0fff4, #c6f6d5, #9ae6b4)"
                : "radial-gradient(circle at bottom, #2D3748, #1A202C, #171923)"
            }
            color={colorMode === "light" ? "black" : "gray.50"}
          >
            <Flex
              as="article"
              width="100%"
              alignItems="center"
              flexDirection="column"
            >
              <Heading
                textAlign="center"
                as="h1"
                size="sm"
                textTransform="uppercase"
                fontWeight="light"
              >
                Cashback Terbesar
              </Heading>
              <Text fontSize="6rem" textAlign="center" fontWeight="light">
                {format(amount, {
                  thousandSeparator: ".",
                  decimalSeparator: "",
                  decimalsDigits: 0
                })}
              </Text>
              <Badge
                variant="solid"
                variantColor="green"
                mb="1rem"
                textAlign="center"
              >
                {index !== -1 && providers[index] ? providers[index].name : ""}
              </Badge>

              <Flex
                flexGrow={1}
                flexDirection="row"
                alignSelf="stretch"
                alignItems="flex-end"
                justifyContent="space-around"
              >
                <Flex flexDirection="column" alignItems="center" mx="1rem">
                  <Editable
                    value={preDiscount}
                    onChange={onChangePreDiscount}
                    placeholder="0"
                  >
                    <EditablePreview
                      textDecoration="line-through"
                      fontSize="lg"
                    />
                    <EditableInput textAlign="center" />
                  </Editable>

                  <Text
                    textAlign="center"
                    fontSize="xs"
                    textTransform="uppercase"
                    opacity="0.75"
                  >
                    Harga sebelum
                    <Box
                      as={FiEdit3}
                      display="inline"
                      ml="0.5rem"
                      position="relative"
                      top="-1px"
                    />
                  </Text>
                </Flex>
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="flex-end"
                  mx="1rem"
                >
                  <Text textAlign="center" fontSize="lg" fontWeight="bold">
                    {format(preDiscount - amount, {
                      thousandSeparator: ".",
                      decimalSeparator: "",
                      decimalsDigits: 0
                    })}
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    textTransform="uppercase"
                    opacity="0.75"
                  >
                    Total bayar
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <List
            display="flex"
            styleType="none"
            flexDirection="row"
            overflowX="scroll"
            flexGrow={1}
            mb="6rem"
            alignItems="center"
            px={2}
          >
            {providers.map((provider, i) => (
              <ListItem key={`${provider.name}${i}`} listStyleType="none">
                <ProviderCard
                  {...provider}
                  updateProvider={updateProvider(i)}
                  isCheapest={index === i}
                  onClose={() => {
                    removeProvider(i);
                  }}
                  preDiscount={preDiscount}
                />
              </ListItem>
            ))}
            <AddProviderButton onClick={addNewProvider} />
          </List>
          <Box
            width="32rem"
            maxWidth="100vw"
            height="6rem"
            bg={colorMode === "light" ? "white" : "gray.900"}
            color={colorMode === "light" ? "black" : "gray.50"}
            position="fixed"
            bottom="0"
            p={2}
            boxShadow={
              colorMode === "light" ? "0 0 16px 8px rgba(64,64,64,0.1)" : "none"
            }
            borderRadius="8px 8px 0 0"
            borderStyle="solid"
            borderWidth="1px"
            borderColor={colorMode === "light" ? "transparent" : "white"}
            borderBottomColor="transparent"
          >
            <Stack spacing={2}>
              <Text
                textAlign="center"
                as="label"
                textTransform="uppercase"
                opacity="0.5"
                fontWeight="light"
                fontSize="sm"
              >
                Harga sebelum cashback
              </Text>
              <NumberInput
                aria-label="Harga sebelum cashback"
                defaultValue={0}
                value={preDiscount}
                onChange={onChangePreDiscount}
                min={0}
                step={500}
              >
                <NumberInputField textAlign="center" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Stack>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
