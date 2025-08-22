import {
	DollarSign,
	MinusCircle,
	PlusCircle,
	Store,
	Truck,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import PixIcon from "../PixIcon";
import {
	CartList,
	CloseButton,
	Content,
	ControlButton,
	DrawerContainer,
	FeeMessage,
	FinalizeButton,
	Footer,
	Form,
	FormGroup,
	Header,
	Input,
	Item,
	ItemControls,
	ItemImage,
	ItemInfo,
	ItemName,
	ItemPrice,
	ItemQuantity,
	Label,
	OptionButton,
	OptionsGroup,
	Overlay,
	SectionTitle,
	Total,
} from "./styles";
// taxa da entrega 7
const DELIVERY_FEE = 7.0;

const ObservationInput = ({ value, onChange }) => (
	<FormGroup>
		<Label htmlFor="observation">Observações</Label>
		<Input
			as="textarea"
			id="observation"
			name="observation"
			placeholder="Ex: retirar cebola, ponto da carne, troco..."
			value={value}
			onChange={onChange}
			rows="2"
		/>
	</FormGroup>
);

const CheckoutDrawer = ({
	isOpen,
	onClose,
	cartItems,
	cartTotal,
	onUpdateQuantity,
	onPixCheckout,
	formData = { name: "", phone: "", address: "", observation: "" },
	onFormChange,
	deliveryType,
	onDeliveryTypeChange,
	showToast,
}) => {
	const [paymentMethod, setPaymentMethod] = useState("pix");
	const [errors, setErrors] = useState({});

	const finalTotal = useMemo(() => {
		let total = cartTotal;
		if (deliveryType === "delivery") total += DELIVERY_FEE;
		if (paymentMethod === "credito") total += CARD_FEE;
		return total;
	}, [cartTotal, deliveryType, paymentMethod]);

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		onFormChange((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = true;
		if (deliveryType === "delivery") {
			if (!formData.phone.trim()) newErrors.phone = true;
			if (!formData.address.trim()) newErrors.address = true;
		}
		return newErrors;
	};

	const handleFinalizeOrder = () => {
		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			showToast("Por favor, preencha os campos em vermelho.", 3000, "error");
			return;
		}
		setErrors({});

		if (paymentMethod === "pix") {
			onPixCheckout(finalTotal);
		} else {
			const getPaymentMethodText = () => {
				switch (paymentMethod) {
					case "dinheiro":

					default:
						return "";
				}
			};


			const orderSummary = cartItems
				.map((item) => `• ${item.quantity}x ${item.name}`)
				.join("%0A");
			const deliveryInfo =
				deliveryType === "delivery"
					? `*Telefone:* ${formData.phone}%0A*Endereço:* ${formData.address}%0A*Taxa de Entrega:* R$ ${DELIVERY_FEE.toFixed(2).replace(".", ",")}`
					: "*Modalidade:* Retirar na Loja";
			const observationInfo = formData.observation
				? `%0A%0A*Observações:*%0A${formData.observation}`
				: "";

			const message = `
        *---------- NOVO PEDIDO ----------*%0A
        %0A*CLIENTE:*%0A*Nome:* ${formData.name}%0A
		%0A*ITENS DO PEDIDO:*%0A${orderSummary}%0A
        %0A*ENTREGA:*%0A${deliveryInfo}${observationInfo}%0A
        %0A*------------------------------------*%0A
        ${cardFeeText}
        *TOTAL:* *R$ ${finalTotal.toFixed(2).replace(".", ",")}*%0A
        *PAGAMENTO:* ${paymentMethodText}
      `
				.trim()
				.replace(/\s+/g, "%20");

			const whatsappNumber = "5548991691906";
			const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

			window.open(whatsappUrl, "_blank");
			onClose();
		}
	};

	return (
		<Overlay>
			<DrawerContainer onClick={(e) => e.stopPropagation()}>
				<Header>
					<h2>Finalizar Pedido</h2>
					<CloseButton onClick={onClose}>
						<X size={24} />
					</CloseButton>
				</Header>
				<Content>
					<SectionTitle>Seu Pedido</SectionTitle>
					<CartList>
						{cartItems.map((item) => (
							<Item key={item.id}>
								<ItemImage src={item.image} alt={item.name} />
								<ItemInfo>
									<ItemName>{item.name}</ItemName>
									<ItemPrice>
										R$ {item.price.toFixed(2).replace(".", ",")}
									</ItemPrice>
								</ItemInfo>
								<ItemControls>
									<ControlButton
										onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
									>
										<MinusCircle size={20} />
									</ControlButton>
									<ItemQuantity>{item.quantity}</ItemQuantity>
									<ControlButton
										onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
									>
										<PlusCircle size={20} />
									</ControlButton>
								</ItemControls>
							</Item>
						))}
					</CartList>
					<SectionTitle>Opção de Entrega</SectionTitle>
					<OptionsGroup>
						<OptionButton
							$isActive={deliveryType === "pickup"}
							onClick={() => onDeliveryTypeChange("pickup")}
						>
							<Store size={20} /> Retirar na Loja
						</OptionButton>
						<OptionButton
							$isActive={deliveryType === "delivery"}
							onClick={() => onDeliveryTypeChange("delivery")}
						>
							<Truck size={20} /> Taxa de entrega: R$ 7,00 até 6 km. Após isso, será adicionada uma taxa extra de 2,00 por km
						</OptionButton>
					</OptionsGroup>
					<SectionTitle>Seus Dados</SectionTitle>
					<Form>
						<FormGroup>
							<Label htmlFor="name">Seu Nome</Label>
							<Input
								type="text"
								id="name"
								name="name"
								placeholder="Ex: Maria Helena de Oliveira"
								value={formData.name}
								onChange={handleInputChange}
								$isInvalid={!!errors.name}
								required
							/>
						</FormGroup>
						{deliveryType === "delivery" ? (
							<>
								<FormGroup>
									<Label htmlFor="phone">Telefone (WhatsApp)</Label>
									<Input
										type="tel"
										id="phone"
										name="phone"
										placeholder="Ex: 48 99999-8888"
										value={formData.phone}
										onChange={handleInputChange}
										$isInvalid={!!errors.phone}
										required
									/>
								</FormGroup>
								<FormGroup>
									<Label htmlFor="address">Endereço Completo</Label>
									<Input
										type="text"
										id="address"
										name="address"
										placeholder="Ex: Rua das Flores, 123, Bairro"
										value={formData.address}
										onChange={handleInputChange}
										$isInvalid={!!errors.address}
										required
									/>
								</FormGroup>
								<ObservationInput
									value={formData.observation}
									onChange={handleInputChange}
								/>
								<FeeMessage type="delivery">
									Taxa de entrega: R${" "}
									{DELIVERY_FEE.toFixed(2).replace(".", ",")}
								</FeeMessage>
							</>
						) : (
							<ObservationInput
								value={formData.observation}
								onChange={handleInputChange}
							/>
						)}
					</Form>
					<SectionTitle>Forma de Pagamento</SectionTitle>
					<OptionsGroup>
						<OptionButton
							$isActive={paymentMethod === "pix"}
							onClick={() => setPaymentMethod("pix")}
						>
							<PixIcon size={20} /> PIX
						</OptionButton>

						<OptionButton
							$isActive={paymentMethod === "dinheiro"}
							onClick={() => setPaymentMethod("dinheiro")}
						>
							<DollarSign size={20} /> Dinheiro
						</OptionButton>
					</OptionsGroup>

					{paymentMethod === "credito" && (
						<FeeMessage type="card">
							Taxa do cartão de crédito: R${" "}
							{CARD_FEE.toFixed(2).replace(".", ",")}
						</FeeMessage>
					)}
				</Content>
				<Footer>
					<Total>
						<span>Total:</span>
						<span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
					</Total>
					<FinalizeButton onClick={handleFinalizeOrder}>
						{paymentMethod === "pix" ? "Pagar com PIX" : "Enviar Pedido"}
					</FinalizeButton>
				</Footer>
			</DrawerContainer>
		</Overlay>
	);
};

export default CheckoutDrawer;
