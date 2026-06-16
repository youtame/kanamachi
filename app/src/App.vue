<template>
    <v-app>
        <v-app-bar color="primary" title="Temporary Quiz" />

        <v-main>
            <v-container class="mt-6">
                <v-card class="pa-4" max-width="400">
                    <v-card-title>MDI SVG Test</v-card-title>

                    <v-card-text class="d-flex justify-space-around my-4">
                        <v-icon
                            :icon="mdiPlayCircle"
                            color="primary"
                            size="large"
                        />
                        <v-icon
                            :icon="mdiCheckCircle"
                            color="success"
                            size="large"
                        />
                        <v-icon
                            :icon="mdiAlertCircle"
                            color="error"
                            size="large"
                        />
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            :prepend-icon="mdiPlayCircle"
                            color="primary"
                            variant="flat"
                        >
                            クイズを始める
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { mdiPlayCircle, mdiCheckCircle, mdiAlertCircle } from "@mdi/js";
</script>
