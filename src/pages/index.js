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
  Badge
} from "@chakra-ui/core";
import { css } from "@emotion/core";

const ProviderCard = ({
  name,
  discountPercentage,
  maxDiscountAmount,
  updateProvider,
  isCheapest
}) => {
  const [currentName, setCurrentName] = useState(name);
  const onChangeName = value => {
    setCurrentName(value);
  };
  const onSubmitName = () => {
    updateProvider({ name: currentName });
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
      discountPercentage: value ? value : 0
    });
  };
  return (
    <Stack
      m={2}
      p={4}
      boxShadow="0 4px 32px 32px rgba(64,64,64,0.05)"
      borderRadius={8}
      minWidth="12rem"
      minHeight="12rem"
      alignItems="center"
      justifyContent="space-between"
      bg={isCheapest ? "green.50" : "white"}
    >
      <Editable
        value={currentName}
        onChange={onChangeName}
        onSubmit={onSubmitName}
        mt={4}
      >
        <EditablePreview
          textAlign="center"
          as="h2"
          fontSize="md"
          fontWeight="bold"
        />
        <EditableInput />
      </Editable>

      <Editable
        value={discountPercentage}
        onChange={onChangeDiscountPercentage}
      >
        <EditablePreview
          textAlign="center"
          as="h3"
          fontSize="6xl"
          fontWeight="bold"
          css={css`
            &:after {
              content: "%";
            }
          `}
        />
        <EditableInput />
      </Editable>

      <Editable value={maxDiscountAmount} onChange={onChangeMaxDiscount}>
        <EditablePreview
          fontSize="sm"
          css={css`
            &:before {
              content: "maks. ";
            }
          `}
        />
        <EditableInput />
      </Editable>
    </Stack>
  );
};

const INITIAL_PRE_DISCOUNT = 0;
const INITIAL_PROVIDERS = [];
const INITIAL_MAX_AMOUNT = { amount: 0, index: -1 };

const useMaxDiscountAmount = (
  initialPreDiscount = INITIAL_PRE_DISCOUNT,
  initialProviders = INITIAL_PROVIDERS
) => {
  const [preDiscount, setPreDiscount] = useState(initialPreDiscount);
  const [providers, setProviders] = useState(initialProviders);

  const getDiscountAmount = useCallback(
    ({ discountPercentage, maxDiscountAmount }) => {
      return Math.min(
        maxDiscountAmount,
        (discountPercentage * preDiscount) / 100
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

  const [{ amount, index }, setMaxDiscountAmount] = useState(() => {
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
    const newProvider = {
      name: `emoney${providers.length + 1}`,
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

  return {
    amount,
    index,
    preDiscount,
    setPreDiscount,
    providers,
    addNewProvider,
    updateProvider
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
    updateProvider
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
        maxWidth="100vw"
        width="32rem"
        flexDirection="column"
        bg="white"
        border="black.400"
        boxShadow="0 0 16px 16px rgba(64,64,64,0.1)"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          height="40vh"
          bg="green.100"
        >
          <Flex alignItems="center" flexDirection="column">
            <Heading
              textAlign="center"
              as="h1"
              size="sm"
              textTransform="uppercase"
            >
              Diskon Terbesar
            </Heading>
            <Text fontSize="6xl" textAlign="center">
              {amount}
            </Text>
            <Badge
              variant="solid"
              variantColor="green"
              mb="1rem"
              textAlign="center"
            >
              {index === -1 ? "No Data" : providers[index].name}{" "}
            </Badge>

            <Flex
              flexGrow={1}
              flexDirection="row"
              alignItems="flex-end"
              justifyContent="space-between"
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
                  <EditableInput />
                </Editable>

                <Text textAlign="center" fontSize="xs">
                  Harga sebelum
                </Text>
              </Flex>
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-end"
                mx="1rem"
              >
                <Text textAlign="center" fontSize="lg" fontWeight="bold">
                  {preDiscount - amount}
                </Text>
                <Text textAlign="center" fontSize="xs">
                  Total bayar
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDirection="row"
          overflowX="scroll"
          flexGrow={1}
          mb="6rem"
          alignItems="center"
          px={2}
        >
          {providers.map((provider, i) => (
            <ProviderCard
              key={`i${provider.name}`}
              {...provider}
              updateProvider={updateProvider(i)}
              isCheapest={index === i}
            />
          ))}

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
            <IconButton
              aria-label="Tambah provider"
              icon="add"
              onClick={addNewProvider}
            />
            <Text textAlign="center" mt={2}>
              Tambah provider
            </Text>
          </Flex>
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
          boxShadow="0 0 16px 16px rgba(64,64,64,0.1)"
          borderRadius={8}
        >
          <Stack spacing={2}>
            <Text textAlign="center" as="label">
              Harga sebelum diskon
            </Text>
            <NumberInput
              aria-label="Harga sebelum diskon"
              defaultValue={0}
              value={preDiscount}
              onChange={onChangePreDiscount}
              min={0}
              step={500}
              textAlign="center"
            >
              <NumberInputField />
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
