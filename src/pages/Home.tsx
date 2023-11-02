import React from "react";
import {
    Heading,
    Icon,
    LinkBox,
    LinkOverlay,
    Stack,
    Text,
    Box,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { MdOutlinePassword } from "react-icons/md";
function Home() {
    return (
        <LinkBox as='article' maxW='sm' p='5' borderWidth='1px' rounded='md'>
            <Icon as={MdOutlinePassword} fontSize='4xl' />

            <Heading>
                <ReactRouterLink to='/login'>
                    {" "}
                    <LinkOverlay>Password Manager</LinkOverlay>
                </ReactRouterLink>

                <Text fontSize='xs' fontWeight='normal' pt='4'>
                    A password manager is your digital guardian for online
                    security. It stores your passwords in a fortified vault,
                    ensuring they're shielded from breaches. With just a single
                    master password to recall, you can access all your accounts
                    effortlessly.
                </Text>
            </Heading>
        </LinkBox>
    );
}

export default Home;
