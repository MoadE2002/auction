import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import axiosInstance from '../apicalls/axiosInstance'; // Adjust the import path as needed

// TypeScript interfaces
interface User {
  id: number;
  email: string;
  role: string;
  image: string | null;
}

const DoctorsList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/users');
        setUsers(response.data.content); // Assuming the API response has a 'content' field
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setIsLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <Card className="h-[500px] overflow-y-scroll">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>Loading users...</CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="h-[500px] overflow-y-scroll">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] overflow-y-scroll">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar & Id</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-gray-100">
                <Link href={`/profile/${user.id}`} passHref>
                  <TableCell className="flex items-center">
                    <Avatar
                      src={user.image || ''}
                      alt={user.email}
                      sx={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {user.id}
                  </TableCell>
                </Link>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DoctorsList;
