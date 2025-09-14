'use client';

import { Flex, Grid, Text } from '@radix-ui/themes';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyUserIcon } from '@/icons/EmptyUserIcon';
import { CameraIcon } from '@/icons/Camera';
import { Textarea } from '@/components/ui/textarea';
import { usePathname } from 'next/navigation';

const FormSchema = z.object({
  industry: z.string({
    required_error: 'Please select an industry to display.',
  }),
  company_size: z.string({
    required_error: 'Please select your company size.',
  }),
  country: z.string({
    required_error: 'Please select your country.',
  }),
  city: z.string({
    required_error: 'Please select your city',
  }),
  company_name: z.string().min(4, {
    message: 'Company Name must be at least 4 characters.',
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(1024, {
      message: "Bio must not be longer than 1024 characters.",
    }),
  company_address: z
    .string()
    .min(10, {
      message: "Company Address must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    }),
});

export function Settings() {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      company_name: '',
      company_size: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Grid columns={'5'} gap={'4'} width={'100%'} className={'mt-4'}>
      <Card className={'col-span-1 shadow-none border-0'}>
        <CardContent>
          <Flex
            direction={'column'}
            gap={'2'}
            className={'*:w-full *:h-12 *:active:bg-muted'}
          >
            <Button
              asChild
              variant={'secondary'}
              className={'flex justify-start rounded-xl'}
            >
              <Link
                href={'/settings/notifications'}
                className={cn('text-left')}
              >
                Account Settings
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname.endsWith("/settings/notifications") ? 'secondary' : "ghost"}
              className={'flex justify-start rounded-xl'}
            >
              <Link
                href={'/settings/notifications'}
                className={cn('text-left')}
              >
                Notifications Preferences
              </Link>
            </Button>
          </Flex>
        </CardContent>
      </Card>

      {/* The Right panel */}
      <Card className={'col-span-4 shadow-none border-0'}>
        <CardHeader>
          <CardTitle className={'flex items-center justify-between'}>
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
          <Tabs defaultValue="basic">
            <TabsList
              className={
                'rounded-full h-12 px-1 bg-muted *:rounded-full *:!shadow-none *:px-4'
              }
            >
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="location">Address & Location</TabsTrigger>
              <TabsTrigger value="contact">Contact Information</TabsTrigger>
              <TabsTrigger value="online">Online Presence</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className={"py-4"}>
              <Flex direction={"column"} gap={"6"}>
                <Flex direction={"column"} gap={"2"}>
                  <Label htmlFor="company-logo" className="text-base font-medium">
                    Company logo
                  </Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <EmptyUserIcon />
                      <div className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 border-muted border">
                        <CameraIcon />
                      </div>
                    </div>
                  </div>
                  <Text color={"gray"} size={"2"}>250x250 Min size / 5 MB Max</Text>
                </Flex>
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input className={"h-12 rounded-lg"} placeholder="Enter Company Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public business / company name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={"w-full !h-12 rounded-lg"}>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={'w-full'}>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={"w-full !h-12 rounded-lg"}>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={'w-full'}>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Flex>
            </TabsContent>
            <TabsContent value="location">
              <Flex direction={"column"} gap={"6"}>
                <FormField
                  control={form.control}
                  name="company_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company address</FormLabel>
                      <FormControl>
                        <Input className={"h-12 rounded-lg"} placeholder="Enter Company Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Flex direction={"row"} align={"center"} gap={"4"} className={"w-full"}>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className={"w-full"}>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={"w-full !h-12 rounded-lg"}>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={'w-full'}>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className={"w-full"}>
                        <FormLabel>City / State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={"w-full !h-12 rounded-lg"}>
                              <SelectValue placeholder="Select city/state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={'w-full'}>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Flex>
              </Flex>
            </TabsContent>
          </Tabs>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </Grid>
  );
}
