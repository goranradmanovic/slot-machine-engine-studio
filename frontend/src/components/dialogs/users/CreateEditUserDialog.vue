<template>
    <Dialog v-model:visible="visible" modal :style="{ 'min-width': '55rem' }" :closable="false" :header="dialogHeaderText">
        <div class="flex items-center justify-content-center">
            <div class="w-full">
                <Form id="reg-form" v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-column gap-4 w-full max-w-sm">
                    <div class="flex gap-4 items-center justify-content-between">
                        <FormField name="username" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="username" class="font-medium">Username *</label>
                            <InputText id="username" type="text" placeholder="Username" fluid />
                            <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                                {{ $field.error.message }}
                            </Message>
                        </FormField>
                        <FormField name="email" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="email" class="font-medium">Email Address *</label>
                            <InputText id="email" type="text" placeholder="Email" fluid />
                            <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                                {{ $field.error.message }}
                            </Message>
                        </FormField>
                    </div>

                    <div v-if="!isEdit" class="flex gap-4 items-center justify-content-between">
                        <FormField name="password" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="password" class="font-medium">Password *</label>
                            <Password id="password" placeholder="Password" toggleMask fluid :feedback="false" />
                            <Message v-if="$field?.error" severity="error" size="small" variant="simple">
                                <ul class="my-0 px-4 flex flex-column gap-1">
                                    <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                                </ul>
                            </Message>
                        </FormField>
                        <FormField name="confirmPassword" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="confirmPassword" class="font-medium">Confirm Password *</label>
                            <Password id="confirmPassword" placeholder="Confirm Password" toggleMask fluid :feedback="false" />
                            <Message v-if="$field?.error" severity="error" size="small" variant="simple">
                                <ul class="my-0 px-4 flex flex-column gap-1">
                                    <li v-for="(error, index) of $form.confirmPassword.errors" :key="index">{{ error.message }}</li>
                                </ul>
                            </Message>
                        </FormField>
                    </div>

                    <div class="flex gap-4 items-center justify-content-between">
                        <FormField name="firstName" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="firstname" class="font-medium">First Name</label>
                            <InputText id="firstname" type="text" placeholder="First Name" fluid />
                            <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                                {{ $field.error.message }}
                            </Message>
                        </FormField>
                        <FormField name="lastName" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="lastname" class="font-medium">Last Name</label>
                            <InputText id="lastname" type="text" placeholder="Last Name" fluid />
                            <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                                {{ $field.error.message }}
                            </Message>
                        </FormField>
                    </div>

                    <div class="flex gap-4 items-center justify-content-between pr-4">
                        <FormField name="permissions" class="flex flex-column gap-1 w-6" v-slot="$field">
                            <label for="permissions" class="font-medium">Permissions</label>
                            <Select v-model="selectedPermissions" :options="permissionsOptions" optionLabel="label" optionValue="value" placeholder="Select Permissions" fluid />
                            <Message v-if="$field?.error" severity="error" variant="simple" size="small">
                                {{ $field.error.message }}
                            </Message>
                        </FormField>
                    </div>
                </Form>
            </div>
        </div>
        <template #footer>
            <div class="flex gap-2 mt-4">
                <Button text severity="secondary" @click="closeDialog">Cancel</Button>
                <Button
                    type="submit"
                    form="reg-form"
                    :disabled="loading"
                    :loading="loading"
                    severity="success"
                    variant="outlined" 
                >
                    <Save />
                    {{ isEdit ? 'Save Changes' : 'Create User' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    import { ref, watch, computed } from "vue"
    import { z } from 'zod'
    import { zodResolver } from '@primevue/forms/resolvers/zod'
    import type { RegisterFormValues, FormSubmitEvent } from '@/types/Form.types'
    import { useApi } from '@/composables/useApi'
    import { useToast } from 'primevue/usetoast'
    import { AuthService } from '@/services/AuthService'
    import { UserService } from '@/services/UserService'
    import { parseJsonArray } from '@/utils/parseJsonArray'

    const props = defineProps<{
        user: {},
        isEdit: boolean
    }>()

    const emits = defineEmits<{
        (e: 'edited', user: {}): void
        (e: 'created', user: {}): void
    }>()

    const { loading, execute } = useApi()
    const toast = useToast()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    watch(
        visible,
        async (open) => {
            if (!open) return

            if (open) {
                setFormValues()
            }
        }
    )

    const dialogHeaderText = computed(() => props.isEdit ? 'Edit User' : 'Create User')

    const closeDialog = () => {
        visible.value = false
    }

    // Define the initial state of the registration form
    const initialValues = ref<RegisterFormValues>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        permissions: ''
    })

    const selectedPermissions = ref<string | null>('basic')
    const permissionsOptions = ref([
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Basic', value: 'basic' }
    ])

    const registerSchema = computed(() => {
        const baseSchema = z.object({
            username: z.string().min(3, { message: 'Username must be at least 3 characters long.' }),
            email: z.string().email({ message: 'Please enter a valid email address.' }),
            firstName: z.string().nullable().optional(),
            lastName: z.string().nullable().optional(),
            permissions: z.string().nullable().optional(),
        })

        if (!props.isEdit) {
            return baseSchema.extend({
                password: z
                    .string()
                    .min(8, { message: 'Password must be at least 8 characters.' })
                    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
                    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
                    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
                    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character.' }),
                confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters.' }),
            }).refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] })
        }

        return baseSchema
    })

    const resolver = computed(() => zodResolver(registerSchema.value))

    const setFormValues = () => {
        if (props.isEdit && props.user) {
            initialValues.value = {
                username: props.user.username || '',
                email: props.user.email || '',
                password: '',
                confirmPassword: '',
                firstName: props.user.firstName || '',
                lastName: props.user.lastName || '',
                permissions: parseJsonArray(props.user.permissions)[0] || 'basic'
            }

            selectedPermissions.value = parseJsonArray(props.user.permissions)[0] || 'basic'
        } else {
            initialValues.value = {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                permissions: 'basic'
            }
        }
    }

    // Handle form submission
    const onFormSubmit = async (e: FormSubmitEvent) => {
        if (e.valid) {
            try {
                if (props.isEdit) {
                    e.values.permissions = JSON.stringify([e.values.permissions])

                    // Edit existing user
                    const result = await execute(() => UserService.updateUser({ id: props.user?.id, ...e.values }))
                    emits('edited', result.data)
                    closeDialog()
                    toast.add({ severity: 'success', summary: 'User Updated!', detail: `User ${e.values.username} updated successfully.`, life: 5000 })
                } else {
                    // Create new user
                    const result = await execute(() => AuthService.register(e.values))
                    emits('created', result.data)
                    closeDialog()
                    toast.add({ severity: 'success', summary: 'Sign up Successful!', detail: `Welcome, ${e.values.username}!`, life: 5000 })
                }

                return
            } catch (err) {
                console.log(err)
                toast.add({ severity: 'error', summary: 'Sign up Failed', detail: err, life: 5000 })
                return
            }
        } else {
            toast.add({ severity: 'error', summary: 'Sign up Failed', detail: 'Please fix the errors in the form.', life: 5000 })
            return
        }
    }
</script>