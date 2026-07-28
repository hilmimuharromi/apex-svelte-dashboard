<script lang="ts">
	import { Card, Input, Label, Textarea, Select, Switch, Button, FormField, ImageUpload, Badge } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import { Store, Truck, CreditCard, Bell, Save, Trash2 } from '@lucide/svelte';

	// SECTION 1: Store Profile State
	let storeProfile = $state({
		storeName: 'Miromi Kids Care',
		logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=miromi-logo&backgroundColor=3b82f6',
		tagline: 'Gentle Protection for Your Little One',
		email: 'hello@miromi.com',
		phone: '081234567890',
		address: 'Jalan Raya Menteng No. 12',
		city: 'Jakarta Pusat',
		postalCode: '10310'
	});

	function saveProfile() {
		if (!storeProfile.storeName.trim()) {
			toast.danger('Store Profile', 'Store Name is required.');
			return;
		}
		// In a real application, an API call would happen here.
		toast.success('Store Profile', 'Store profile details saved successfully.');
	}

	// SECTION 2: Shipping Rates State
	let shippingRates = $state([
		{ courier: 'JNE', service: 'REG', region: 'Jabodetabek', cost: 9000, etd: '1-2 hari' },
		{ courier: 'SiCepat', service: 'Gokil', region: 'Pulau Jawa', cost: 15000, etd: '3-4 hari' },
		{ courier: 'J&T', service: 'EZ', region: 'Luar Jawa', cost: 22000, etd: '2-5 hari' }
	]);

	function addShippingRate() {
		shippingRates.push({
			courier: 'SiCepat',
			service: 'REG',
			region: 'Jabodetabek',
			cost: 10000,
			etd: '2-3 hari'
		});
		toast.info('Shipping Option', 'Added a new delivery rate entry.');
	}

	function removeShippingRate(index: number) {
		shippingRates.splice(index, 1);
		toast.info('Shipping Option', 'Removed a delivery rate entry.');
	}

	function saveShipping() {
		for (const rate of shippingRates) {
			if (!rate.courier.trim() || !rate.service.trim() || !rate.region.trim()) {
				toast.danger('Shipping Rates', 'Please fill in all courier, service, and region fields.');
				return;
			}
			if (rate.cost < 0) {
				toast.danger('Shipping Rates', 'Tariff cost cannot be negative.');
				return;
			}
		}
		toast.success('Shipping Rates', 'Shipping configurations and rates saved successfully.');
	}

	// SECTION 3: Payment Config State
	let paymentConfigs = $state([
		{ method: 'QRIS', displayName: 'QRIS (E-Wallet)', isActive: true, feeType: 'percentage' as const, feeValue: 0.7 },
		{ method: 'VA BCA', displayName: 'VA BCA', isActive: true, feeType: 'fixed' as const, feeValue: 4000 },
		{ method: 'VA Mandiri', displayName: 'VA Mandiri', isActive: true, feeType: 'fixed' as const, feeValue: 4000 },
		{ method: 'GoPay', displayName: 'GoPay', isActive: true, feeType: 'percentage' as const, feeValue: 2.0 },
		{ method: 'OVO', displayName: 'OVO', isActive: false, feeType: 'percentage' as const, feeValue: 1.5 },
		{ method: 'Dana', displayName: 'Dana', isActive: false, feeType: 'percentage' as const, feeValue: 1.5 }
	]);

	function savePayments() {
		toast.success('Payment Methods', 'Payment gateway toggles and fee structures saved.');
	}

	// SECTION 4: Notification Templates State
	let notificationTemplates = $state({
		orderConfirmation: 'Halo {{customerName}}, terima kasih telah berbelanja di Miromi! Pesanan Anda {{orderId}} sebesar {{amount}} telah kami terima dan sedang diproses.',
		shippingUpdate: 'Kabar baik! Paket Anda {{orderId}} telah diserahkan ke kurir {{courier}} dengan nomor resi pelacakan {{trackingNumber}}.',
		deliveryConfirmation: 'Hooray! Paket {{orderId}} telah dikonfirmasi sampai di tempat tujuan. Semoga si kecil senang memakai produk kami!'
	});

	function saveNotifications() {
		toast.success('Notification Templates', 'Messaging & template configurations updated.');
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Store Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage store profile, logistics rate matrices, payment gateways, and templates.</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-1">
		
		<!-- SECTION 1: Store Profile -->
		<Card title="Store Profile" description="Change your store's branding details and customer-facing contact.">
			<div class="space-y-4">
				<ImageUpload label="Store Logo" bind:value={storeProfile.logo} />

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
					<FormField label="Store Name" required>
						<Input bind:value={storeProfile.storeName} placeholder="e.g. Miromi Kids Care" />
					</FormField>
					<FormField label="Tagline">
						<Input bind:value={storeProfile.tagline} placeholder="e.g. Gentle Care for Baby Kulit Sensitive" />
					</FormField>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField label="Store Email Contact">
						<Input type="email" bind:value={storeProfile.email} placeholder="hello@miromi.com" />
					</FormField>
					<FormField label="Phone Support Number">
						<Input bind:value={storeProfile.phone} placeholder="e.g. 081234567890" />
					</FormField>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField class="md:col-span-2" label="Address Location">
						<Input bind:value={storeProfile.address} placeholder="Jalan, RT/RW, Building details..." />
					</FormField>
					<div class="grid grid-cols-2 gap-2">
						<FormField label="City">
							<Input bind:value={storeProfile.city} placeholder="Jakarta" />
						</FormField>
						<FormField label="Postal Code">
							<Input bind:value={storeProfile.postalCode} placeholder="10310" />
						</FormField>
					</div>
				</div>
			</div>

			{#snippet footer()}
				<div class="flex justify-end gap-2">
					<Button onclick={saveProfile} class="gap-1.5">
						<Save class="h-4 w-4" /> Save Profile
					</Button>
				</div>
			{/snippet}
		</Card>

		<!-- SECTION 2: Shipping Rates Matrix -->
		<Card title="Shipping Rates & Logistics" description="Define region-based carrier options, delivery time estimates, and standard flat rates.">
			
			<div class="space-y-4 mt-2">
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left border border-border rounded-lg overflow-hidden">
						<thead>
							<tr class="bg-muted/40 border-b border-border text-muted-foreground text-xs font-semibold uppercase">
								<th class="p-3">Courier</th>
								<th class="p-3">Service Name</th>
								<th class="p-3">Coverage Region</th>
								<th class="p-3 text-right" style="width: 140px;">Tariff (IDR)</th>
								<th class="p-3" style="width: 120px;">ETD</th>
								<th class="p-3 text-center" style="width: 60px;">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each shippingRates as rate, idx}
								<tr class="hover:bg-muted/10 transition-colors">
									<td class="p-2">
										<Input bind:value={rate.courier} placeholder="JNE / SiCepat/ GoSend" class="h-8" />
									</td>
									<td class="p-2">
										<Input bind:value={rate.service} placeholder="REG / YES / OK" class="h-8" />
									</td>
									<td class="p-2">
										<Input bind:value={rate.region} placeholder="Jabodetabek / Jawa / Bali" class="h-8" />
									</td>
									<td class="p-2">
										<Input type="number" bind:value={rate.cost} min="0" step="500" class="h-8 text-right font-mono" />
									</td>
									<td class="p-2">
										<Input bind:value={rate.etd} placeholder="e.g. 1-2 hari" class="h-8" />
									</td>
									<td class="p-2 text-center">
										<Button variant="ghost" size="sm" class="h-8 w-8 p-0 text-danger hover:bg-danger/10" onclick={() => removeShippingRate(idx)}>
											<Trash2 class="h-4 w-4" />
										</Button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="flex justify-between items-center pt-2">
					<Button variant="outline" size="sm" onclick={addShippingRate} class="gap-1">
						<Truck class="h-3.5 w-3.5" /> Add Delivery Route
					</Button>
				</div>
			</div>

			{#snippet footer()}
				<div class="flex justify-end">
					<Button onclick={saveShipping} class="gap-1.5">
						<Save class="h-4 w-4" /> Save Logistics Configuration
					</Button>
				</div>
			{/snippet}
		</Card>

		<!-- SECTION 3: Payment Gateway Configuration -->
		<Card title="Payment configurations" description="Activate payment channels and manage vendor transaction fees.">
			
			<div class="space-y-4 divider-y divide-border mt-2">
				{#each paymentConfigs as channel}
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border last:border-b-0">
						<div class="flex items-center gap-3">
							<Switch bind:checked={channel.isActive} />
							<div>
								<span class="font-medium text-sm text-card-foreground flex items-center gap-2">
									{channel.displayName}
									{#if channel.isActive}
										<Badge variant="success">Active</Badge>
									{:else}
										<Badge variant="default">Disabled</Badge>
									{/if}
								</span>
								<p class="text-xs text-muted-foreground mt-0.5">Gateway method code: {channel.method}</p>
							</div>
						</div>

						<div class="flex items-center gap-2 self-end sm:self-center">
							<FormField label="Fee Structure" class="w-32">
								<Select bind:value={channel.feeType} class="h-8 py-0">
									<option value="fixed">Fixed Flat</option>
									<option value="percentage">Percent (%)</option>
								</Select>
							</FormField>
							<FormField label={channel.feeType === 'percentage' ? 'Fee (%)' : 'Fee (IDR)'} class="w-24">
								<Input type="number" bind:value={channel.feeValue} min="0" step="0.1" class="h-8 text-right font-mono" />
							</FormField>
						</div>
					</div>
				{/each}
			</div>

			{#snippet footer()}
				<div class="flex justify-end">
					<Button onclick={savePayments} class="gap-1.5">
						<Save class="h-4 w-4" /> Save Payments Config
					</Button>
				</div>
			{/snippet}
		</Card>

		<!-- SECTION 4: Notification Templates -->
		<Card title="Notification & Messaging Templates" description="Draft automated customer notification content triggered by status changes.">
			
			<div class="space-y-4 mt-2">
				<FormField label="Order Confirmed Template" description="Sent when payment is verified and order switches to paid.">
					<Textarea bind:value={notificationTemplates.orderConfirmation} rows={3} placeholder="Notification content..." />
				</FormField>

				<FormField label="Shipping Update Template" description="Sent when package is marked as shipped by courier.">
					<Textarea bind:value={notificationTemplates.shippingUpdate} rows={3} placeholder="Notification content..." />
				</FormField>

				<FormField label="Delivery Confirmation Template" description="Sent when tracking confirms package delivered.">
					<Textarea bind:value={notificationTemplates.deliveryConfirmation} rows={3} placeholder="Notification content..." />
				</FormField>
			</div>

			{#snippet footer()}
				<div class="flex justify-end">
					<Button onclick={saveNotifications} class="gap-1.5">
						<Save class="h-4 w-4" /> Save Templates
					</Button>
				</div>
			{/snippet}
		</Card>
	</div>
</div>
