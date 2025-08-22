// orarios e dias de funcionamentos em baixo
import { useCallback, useEffect, useMemo, useState } from "react";
import AddonModal from "../../components/AddonModal";
import CheckoutDrawer from "../../components/CheckoutDrawer";
import ClosedStoreModal from "../../components/ClosedStoreModal";
import DishOfTheDayCard from "../../components/DishOfTheDayCard";
import FlavorModal from "../../components/FlavorModal";
import FloatingCartButton from "../../components/FloatingCartButton";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import PixModal from "../../components/PixModal";
import ProductCard from "../../components/ProductCard";
import QuantityModal from "../../components/QuantityModal";
import Toast from "../../components/Toast";
import { mockData } from "../../data/mock";
import useCountdown from "../../hooks/useCountdown";
import {
	AppContainer,
	DishOfTheDayTitle,
	Header,
	HeaderSlogan,
	HeaderTitle,
	MainContent,
	MenuSection,
	ProductList,
	SectionTitle,
	StatusBadge,
	ToastManager,
} from "./styles";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [cart, setCart] = useState([]);
	const [isPixModalOpen, setPixModalOpen] = useState(false);
	const [pixTotal, setPixTotal] = useState(0);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [toasts, setToasts] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		observation: "",
	});
	const [deliveryType, setDeliveryType] = useState("pickup");
	const [isStoreOpen, setIsStoreOpen] = useState(false);   //essa
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [selectedProductForQuantity, setSelectedProductForQuantity] =
		useState(null);
	const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
	const [selectedProductForAddon, setSelectedProductForAddon] = useState(null);
	const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
	const [productWithAddon, setProductWithAddon] = useState(null);
	const countdown = useCountdown(11);

	const handleLoadingComplete = useCallback(() => {
		setIsLoading(false);
	}, []);


	
	//dias da semana e horario de atendimeto altomatico
	useEffect(() => {
		const checkStoreStatus = () => {
			const now = new Date();
			const currentHour = now.getHours();
			const currentDay = now.getDay();
			// getDay(): 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

			// Loja aberta de segunda (1) a sábado (6)
			// Duas faixas de horário:
			// - 10h às 16h
			// - 18h às 00h
			const isOpen =
				currentDay >= 1 &&
				currentDay <= 6 &&
				(
					(currentHour >= 10 && currentHour < 16) || // manhã/tarde
					(currentHour >= 18 && currentHour < 24)   // noite
				);

			setIsStoreOpen(isOpen);
		};

		checkStoreStatus(); // Checa logo quando o componente monta
		const interval = setInterval(checkStoreStatus, 60000); // Atualiza a cada minuto

		return () => clearInterval(interval); // Limpa intervalo ao desmontar
	}, []);


	useEffect(() => {
		const body = document.body;
		const isAnyModalOpen =
			isDrawerOpen ||
			isPixModalOpen ||
			isQuantityModalOpen ||
			isAddonModalOpen ||
			isFlavorModalOpen;
		body.style.overflow = isAnyModalOpen ? "hidden" : "auto";
		return () => {
			body.style.overflow = "auto";
		};
	}, [
		isDrawerOpen,
		isPixModalOpen,
		isQuantityModalOpen,
		isAddonModalOpen,
		isFlavorModalOpen,
	]);

	const showToast = (message, duration = 3000, type = "info") => {
		const id = Date.now() + Math.random();
		setToasts((prev) => [...prev, { id, message, duration, type }]);
	};

	const handleCloseToast = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const handleUpdateQuantity = (productId, newQuantity) => {
		if (newQuantity <= 0) {
			setCart((prev) => prev.filter((item) => item.id !== productId));
		} else {
			setCart((prev) =>
				prev.map((item) =>
					item.id === productId ? { ...item, quantity: newQuantity } : item,
				),
			);
		}
	};

	const handleAddToCart = (productToAdd, quantity = 1, flavor = null) => {
		if (!isStoreOpen) {
			showToast("Desculpe, estamos fechados no momento.", 3000, "error");
			return;
		}

		const finalProduct = { ...productToAdd };
		if (flavor) {
			finalProduct.name = `${productToAdd.name} de ${flavor}`;
			finalProduct.id = `${productToAdd.id}-${flavor.toLowerCase()}`;
		}

		setCart((prev) => {
			const existing = prev.find((item) => item.id === finalProduct.id);
			if (existing) {
				return prev.map((item) =>
					item.id === finalProduct.id
						? { ...item, quantity: item.quantity + quantity }
						: item,
				);
			}
			return [...prev, { ...finalProduct, quantity }];
		});
		showToast(`${finalProduct.name} adicionado!`, 2000, "success");
	};

	const handleOpenAddonModal = (product) => {
		if (!isStoreOpen) {
			showToast("Desculpe, estamos fechados no momento.", 3000, "error");
			return;
		}
		if (!product.addon) {
			handleAddToCart(product);
			return;
		}
		setSelectedProductForAddon(product);
		setIsAddonModalOpen(true);
	};

	const handleConfirmAddon = (product, withAddon) => {
		const productToProcess = { ...product };
		if (withAddon) {
			productToProcess.name = `${product.name} ${product.addon.name}`;
			productToProcess.price += product.addon.price;
			productToProcess.id = `${product.id}-addon`;
		}

		if (product.name.toLowerCase().includes("panqueca")) {
			setProductWithAddon(productToProcess);
			setIsFlavorModalOpen(true);
		} else {
			handleAddToCart(productToProcess);
		}
	};

	const handleOpenQuantityModal = (product) => {
		if (!isStoreOpen) {
			showToast("Desculpe, estamos fechados no momento.", 3000, "error");
			return;
		}
		setSelectedProductForQuantity(product);
		setIsQuantityModalOpen(true);
	};

	const handleConfirmFlavor = (flavor) => {
		if (productWithAddon) {
			handleAddToCart(productWithAddon, 1, flavor);
			setProductWithAddon(null);
		}
	};

	const cartTotal = useMemo(
		() => cart.reduce((total, item) => total + item.price * item.quantity, 0),
		[cart],
	);
	const cartItemCount = useMemo(
		() => cart.reduce((count, item) => count + item.quantity, 0),
		[cart],
	);

	const handlePixCheckout = (finalTotal) => {
		if (cart.length > 0) {
			setPixTotal(finalTotal);
			setDrawerOpen(false);
			setPixModalOpen(true);
		}
	};

	const handleClosePixModal = () => {
		setPixModalOpen(false);
		setCart([]);
		setFormData({ name: "", phone: "", address: "", observation: "" });
		setDeliveryType("pickup");
	};

	const handleFloatingCartClick = () => {
		if (!isStoreOpen) {
			showToast("Desculpe, estamos fechados no momento.", 3000, "error");
			return;
		}
		if (cartItemCount === 0) {
			showToast("Seu carrinho está vazio!");
		} else {
			setDrawerOpen(true);
		}
	};

	const productsByCategory = useMemo(() => {
		return mockData.products.reduce((acc, product) => {
			const category = product.category || "Outros";
			if (!acc[category]) acc[category] = [];
			acc[category].push(product);
			return acc;
		}, {});
	}, []);

	if (isLoading) {
		return <Loader onLoaded={handleLoadingComplete} />;
	}

	return (
		<AppContainer>
			<ToastManager>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						id={toast.id}
						message={toast.message}
						duration={toast.duration}
						type={toast.type}
						onClose={handleCloseToast}
					/>
				))}
			</ToastManager>

			<Header>
				<HeaderTitle>A vitrine para seu negócio brilhar</HeaderTitle>
				<HeaderSlogan>"Aberto de Segunda à Sábado, 10:00 - 16:00 as 18:00 - 24:00"</HeaderSlogan>
				<StatusBadge
					$isOpen={isStoreOpen}
					style={{
						width: "243px",   //largura
						height: "57px",   //tamanho
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "30px",   // aumenta o tamanho da mensagem
						fontWeight: "bold",
						padding: "5px",
						textAlign: "center",
					}}
				>
					{isStoreOpen ? "Aberto" : "Fechado"}
				</StatusBadge>

			</Header>

			<MainContent>
				<MenuSection>
					<DishOfTheDayTitle>Prato do Dia</DishOfTheDayTitle>
					<DishOfTheDayCard
						product={mockData.dishOfTheDay}
						onAddToCart={handleAddToCart}
						onOpenAddonModal={handleOpenAddonModal}
						isStoreOpen={isStoreOpen}
						countdown={countdown}
					/>
				</MenuSection>

				{Object.entries(productsByCategory).map(([category, products]) => (
					<MenuSection key={category}>
						<SectionTitle>{category}</SectionTitle>
						<ProductList>
							{products.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onAddToCart={handleAddToCart}
									onOpenAddonModal={handleOpenAddonModal}
									onOpenQuantityModal={handleOpenQuantityModal}
									isStoreOpen={isStoreOpen}
									countdown={countdown}
								/>
							))}
						</ProductList>
					</MenuSection>
				))}
			</MainContent>

			<FloatingCartButton
				itemCount={cartItemCount}
				onClick={handleFloatingCartClick}
			/>

			<QuantityModal
				isOpen={isQuantityModalOpen}
				onClose={() => setIsQuantityModalOpen(false)}
				product={selectedProductForQuantity}
				onConfirm={handleAddToCart}
			/>

			<AddonModal
				isOpen={isAddonModalOpen}
				onClose={() => setIsAddonModalOpen(false)}
				product={selectedProductForAddon}
				onConfirm={handleConfirmAddon}
			/>

			<FlavorModal
				isOpen={isFlavorModalOpen}
				onClose={() => setIsFlavorModalOpen(false)}
				onConfirm={handleConfirmFlavor}
			/>

			<CheckoutDrawer
				isOpen={isDrawerOpen}
				onClose={() => setDrawerOpen(false)}
				cartItems={cart}
				cartTotal={cartTotal}
				onUpdateQuantity={handleUpdateQuantity}
				onPixCheckout={handlePixCheckout}
				formData={formData}
				onFormChange={setFormData}
				deliveryType={deliveryType}
				onDeliveryTypeChange={setDeliveryType}
				showToast={showToast}
			/>

			{isPixModalOpen && (
				<PixModal
					total={pixTotal}
					onClose={handleClosePixModal}
					formData={formData}
					cartItems={cart}
					deliveryType={deliveryType}
				/>
			)}

			<Footer />

			{/* {!isLoading && !isStoreOpen && <ClosedStoreModal />} */}
		</AppContainer>
	);
}
