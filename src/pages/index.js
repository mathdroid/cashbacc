import { useState, useCallback, useEffect } from "react";
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
  ListItem
} from "@chakra-ui/core";
import { css } from "@emotion/core";
import createPersistedState from "use-persisted-state";
import { FiEdit3 } from "react-icons/fi";
import { format } from "number-currency-format";

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
  isCheapest
}) => {
  const [currentInputName, setCurrentInputName] = useState(name);
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
      boxShadow="0 4px 32px 32px rgba(64,64,64,0.05)"
      borderRadius={8}
      width="12rem"
      height="12rem"
      alignItems="center"
      justifyContent="space-between"
      bg={isCheapest ? "green.50" : "white"}
      position="relative"
      top={isCheapest ? "-8px" : "0"}
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
              opacity: 0.5;
              content: "%";
            }
          `}
        />
        <EditableInput textAlign="center" />
      </Editable>

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

const AddProviderButton = ({ onClick }) => (
  <Flex
    flexDirection="column"
    border="dashed 1px"
    borderColor="black.200"
    minWidth="12rem"
    minHeight="12rem"
    borderRadius={8}
    alignItems="center"
    justifyContent="center"
    mx={2}
  >
    <IconButton aria-label="Tambah provider" icon="add" onClick={onClick} />
    <Text textAlign="center" mt={2}>
      Tambah provider
    </Text>
  </Flex>
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
    const getNewName = (run = 0) => {
      const newName =
        RANDOM_NAMES[Math.round(Math.random() * RANDOM_NAMES.length) - 1];

      return providers.some(p => p.name === newName)
        ? run <= 3
          ? getNewName(run + 1)
          : `${newName}2`
        : newName;
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

  const onChangePreDiscount = raw => {
    const value = parseInt(raw, 10);
    setPreDiscount(() => (value ? value : 0));
  };

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      bgColor="brand.400"
      flexDirection="row"
      justifyContent="center"
      bg="brand.400"
    >
      <Flex
        as="main"
        maxWidth="100vw"
        width="32rem"
        flexDirection="column"
        bg="white"
        border="black.400"
        boxShadow="0 0 16px 16px rgba(64,64,64,0.1)"
      >
        <Flex
          as="section"
          alignItems="center"
          justifyContent="center"
          height="40vh"
          background="radial-gradient(circle at bottom, #f0fff4, #c6f6d5, #9ae6b4)"
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
        <Flex
          as="ul"
          flexDirection="row"
          overflowX="scroll"
          flexGrow={1}
          mb="6rem"
          alignItems="center"
          px={2}
        >
          {providers.map((provider, i) => (
            <ListItem key={`${provider.name}${i}`}>
              <ProviderCard
                {...provider}
                updateProvider={updateProvider(i)}
                isCheapest={index === i}
                onClose={() => {
                  removeProvider(i);
                }}
              />
            </ListItem>
          ))}
          <AddProviderButton onClick={addNewProvider} />
        </Flex>
        <Box
          width="32rem"
          maxWidth="100vw"
          height="6rem"
          bg="white"
          position="fixed"
          bottom="0"
          p={2}
          bg="white"
          boxShadow="0 0 16px 8px rgba(64,64,64,0.1)"
          borderRadius={8}
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
  );
};
