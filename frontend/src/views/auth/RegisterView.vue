<template>
  <div class="flex justify-content-center align-items-center w-full h-full">
    <Toast />
    
    <Card class="w-24rem">
        <template #title>Create an Account</template>

        <template #content>
            <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-column gap-4 w-full max-w-sm">
      
                <FormField name="username" class="flex flex-column gap-1" v-slot="$field">
                    <label for="username" class="font-medium">Username</label>
                    <InputText id="username" type="text" placeholder="Username" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <!--<FormField name="firstName" class="flex flex-column gap-1" v-slot="$field">
                    <label for="firstName" class="font-medium">First Name</label>
                    <InputText id="fistName" type="text" placeholder="First Name" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField name="lastName" class="flex flex-column gap-1" v-slot="$field">
                    <label for="lastName" class="font-medium">Last Name</label>
                    <InputText id="lastName" type="text" placeholder="Last Name" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>-->

                <FormField name="email" class="flex flex-column gap-1" v-slot="$field">
                    <label for="email" class="font-medium">Email Address</label>
                    <InputText id="email" type="text" placeholder="Email" fluid />
                    <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                        {{ $field.error.message }}
                    </Message>
                </FormField>

                <FormField name="password" class="flex flex-column gap-1" v-slot="$field">
                    <label for="password" class="font-medium">Password</label>
                    <Password id="password" placeholder="Password" toggleMask fluid :feedback="false" />
                    <Message v-if="$field?.error" severity="error" size="small" variant="simple">
                        <ul class="my-0 px-4 flex flex-column gap-1">
                            <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                        </ul>
                    </Message>
                </FormField>

                <Button type="submit" label="Sign up" fluid severity="secondary">
                    <Spinner v-if="loading" />
                </Button>
            </Form>
        </template>

        <template #footer>
            <p class="text-xs mt-3">
                Have an account? 
                <RouterLink to="/login" class="text-primary">Sign In</RouterLink>
            </p>
        </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { z } from 'zod'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import { useToast } from 'primevue/usetoast'
    import type { RegisterFormValues, FormSubmitEvent } from '@/types/Form.types'
    import { useApi } from '@/composables/useApi'
    import { useRouter } from 'vue-router'
    import { AuthService } from '@/services/AuthService'
    import { ConfigService } from '@/services/ConfigService'

    const router = useRouter()
    const toast = useToast()
    const { loading, error, execute } = useApi()

    // Define the initial state of the registration form
    const initialValues = ref<RegisterFormValues>({
        username: '',
        //firstName: '',
        //lastName: '',
        email: '',
        password: ''
    })

    // Define the validation rules using Zod
    const registerSchema = z.object({
        username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }),
        //firstName: z.string().min(2, { message: 'First name must be at least 2 characters long.' }),
        //lastName: z.string().min(2, { message: 'Username must be at least 2 characters long.' }),
        email: z.email({ message: 'Please enter a valid email address.' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
            .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
            .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
            .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character.' })
    })

    // Create the resolver
    const resolver = ref(zodResolver(registerSchema))

    // Handle form submission
    const onFormSubmit = async (e: FormSubmitEvent) => {

        await execute(() => ConfigService.createConfigFolder({ userId: 1 }))
        /*if (e.valid) {
            try {
                const response = await execute(() => AuthService.register(e.values))

                const folderName = `config-${response.data.id}`

                console.log('response - ', response)
                console.log('folder name - ', { folderName })

                //await execute(() => ConfigService.createConfigFolder({ folderName }))

                toast.add({ severity: 'success', summary: 'Sign up Successful!', detail: `Welcome, ${e.values.username}!`, life: 5000 })
                router.replace({ name: 'login' })
                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Sign up Failed', detail: error.value, life: 5000 })
                return
            }
        } else {
            toast.add({ severity: 'error', summary: 'Sign up Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }*/
    }
</script>