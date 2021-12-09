import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Flex
} from '@chakra-ui/react'

import {ChevronDownIcon} from '@chakra-ui/icons'

import {Link} from 'react-router-dom' 

export default function Menus(){
    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>Menu</MenuButton>
            <MenuList>
                <Link to='/'>
                    <MenuItem>Home</MenuItem>
                </Link>
                <Link to='/transactions'>
                    <MenuItem>History</MenuItem>
                </Link>
            </MenuList>
        </Menu>
    );
}
