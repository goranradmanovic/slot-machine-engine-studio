<template>
    <div class="profile-settings-view">
        <Panel>
            <template #header>
                <h2 class="text-2xl font-bold">Profile Settings</h2>
            </template>

            <div class="flex flex-column justify-content-center align-items-center gap-4">
                <Card class="border-1 surface-border w-min" >
                    <template #content>
                        <Tabs v-model:value="tab" class="max-w-md mx-auto">
                            <TabList>
                                <Tab value="tab1" class="flex items-center gap-2!">
                                    <User />
                                    Account Info
                                </Tab>
                                <Tab value="tab2" class="flex items-center gap-2!">
                                    <UserEdit />
                                    Account Update
                                </Tab>
                                <Tab value="tab3" class="flex items-center gap-2!">
                                    <Key />
                                    Security
                                    <Badge size="small" value="New" />
                                </Tab>
                                <Tab value="tab4" class="flex items-center gap-2!">
                                    <Cog />
                                    Preferences
                                </Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel value="tab1">
                                    <AccountInfo @edit-account="handleEditAccount()" @edit-security="handleEditSecurity()"/>
                                </TabPanel>
                                <TabPanel value="tab2">
                                    <AccountUpdate />
                                </TabPanel>
                                <TabPanel value="tab3">
                                    <AccountSecurity />
                                </TabPanel>
                                <TabPanel value="tab4">
                                    <AccountPreferences />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </template>
                </Card>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import AccountInfo from '@/components/settings/AccountInfo.vue'
    import AccountUpdate from '@/components/settings/AccountUpdate.vue'
    import AccountSecurity from '@/components/settings/AccountSecurity.vue'
    import AccountPreferences from '@/components/settings/AccountPreferences.vue'

    const tab = ref<string>('tab1')

    const handleEditAccount = () => tab.value = 'tab2'
    const handleEditSecurity = () => tab.value = 'tab3'
</script>