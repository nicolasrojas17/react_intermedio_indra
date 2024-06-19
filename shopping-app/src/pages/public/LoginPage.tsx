import {
  Avatar,
  Box,
  Button,
  ChakraProvider,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  Text,
  extendTheme,
} from "@chakra-ui/react";
import HttpsIcon from "@mui/icons-material/Https";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Field, Form, Formik } from "formik";
import { useContext, useRef, useState } from "react";
import * as Yup from "yup";
import { login } from "../../services/userService";
import { UserContext } from "../../hooks/UserContextProvider";
import { ROLE } from "../../interfaces/User";

const loginSchema = Yup.object().shape({
  password: Yup.string().min(1, "Campo obligatorio.").required("Campo requerido."),
  email: Yup.string().email("El correo electrónico no es válido.").required("Campo requerido."),
});

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = { email: "", password: "" };

const LoginPage = () => {
  const userContext = useContext(UserContext);
  const { setUser } = userContext;

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const authErrorRef = useRef(null);

  const theme = extendTheme({
    colors: {
      brand: { 50: "#FFFFFF", 500: "#000000" },
    },
  });

  const onSubmit = async (values: FormValues) => {
    const resp = await login(values.email, values.password);
    if (resp) {
      setUser({ username: resp.username, role: resp.username === "johnd" ? ROLE.ADMIN : ROLE.USER });
    } else {
      const authRef = authErrorRef?.current as any;
      if (authRef) authRef.style.display = "block";
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex flexDirection="column" width="100wh" marginTop={"100px"} justifyContent="center" alignItems="center">
        <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
          <Avatar />
          <Heading>Welcome</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={onSubmit}>
              <Form>
                <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <PersonIcon />
                      </InputLeftElement>
                      <Field name="email">
                        {({ field, form: { touched, errors } }: any) => {
                          return (
                            <Flex width="100%" flexDirection={"column"}>
                              <Input {...field} paddingLeft={10} name="email" type="text" placeholder="email address" />
                              {touched[field.name] && errors[field.name] && (
                                <FormHelperText color={"red.600"}>{errors[field.name]}</FormHelperText>
                              )}
                            </Flex>
                          );
                        }}
                      </Field>
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <HttpsIcon />
                      </InputLeftElement>

                      <Field name="password">
                        {({ field, form: { touched, errors } }: any) => {
                          return (
                            <Flex width="100%" flexDirection={"column"}>
                              <Input
                                {...field}
                                paddingLeft={10}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                              />
                              {touched[field.name] && errors[field.name] && (
                                <FormHelperText color={"red.600"}>{errors[field.name]}</FormHelperText>
                              )}
                            </Flex>
                          );
                        }}
                      </Field>

                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick} bg={"none"}>
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Text ref={authErrorRef} display={"none"} color={"red.600"}>
                    Usuario o contraseña incorrecto
                  </Text>

                  <Button borderRadius={0} type="submit" variant="solid" colorScheme="brand" width="full">
                    Login
                  </Button>
                </Stack>
              </Form>
            </Formik>
          </Box>
        </Stack>
        <Box>
          New to us?
          <Link color="teal.500" href="#">
            Sign Up
          </Link>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LoginPage;
