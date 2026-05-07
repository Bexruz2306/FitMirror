import React, { useEffect, useState } from 'react'
import './price.scss'
import { useTranslation } from 'react-i18next';
import { httpGetRequisets, httpPostRequisets } from '../../host/Requiests';
import { Button, message, Modal, Radio } from 'antd';
import Cookies from 'js-cookie';
import click from '../../img/click.jpg'
import payme from '../../img/payme.jpg'
import { useNavigate } from 'react-router-dom';


const PLANS = [
  { key: 'FREE',  count: 1,  price:0,  color: '#888',    features: [true, false, false] },
  { key: 'PLUS',  count: 10, price: 3.99, color: '#5DCAA5', features: [true, true, false] },
  { key: 'PRO',   count: 20, price: 6.99, color: '#AFA9EC', features: [true, true, true], popular: false },
  { key: 'PRIME', count: 40, price: 11.99, color: '#EF9F27', features: [true, true, true] },
];

const CREDITS = [
  { key: 'SINGLE', price:0.59,  count: 1 },  
  { key: 'MINI',   price:1.69,  count: 3 },
  { key: 'BASIC',  price:2.79,  count: 5 },
  { key: 'POWER',  price:4.99,  count: 10 },
];

const FEATURES = ['generate', 'history', 'priority'];
export default function Price() {


 
    const {t,i18n}=useTranslation();
    const [userPlan,setUserPlan]=useState(null);
    const [loading,setloading]=useState(false);
    const [creditLoad,setCreditLoad]=useState(false);
    const token = Cookies.get('fitmirror_token');
    const [modalFnOpen, setModalFnOpen] = useState(false);
    const [modalloading, setmodaloading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState('CLICK');
    const [providers, setProviders] = useState([]);
    const [pricing, setPricing] = useState([]); 
    const navigate=useNavigate()


    useEffect(()=>{
      
        const GetMe=async()=>{
            if (!token) return;
            try{
                const res=await httpGetRequisets("/users/me");
                setUserPlan(res.data.data);
            }
            catch(err){
                console.error(err);
            }
        }

  GetMe();
  GetProviders();
  GetPricing();
    },[i18n.language])
const GetProviders=async()=>{
  try{
    var res=await httpGetRequisets("/users/payments/providers");
    setProviders(res.data.data);
    
  }
catch(err){
  console.error(err);
}}
const GetPricing=async()=>{
  try{
    var res=await httpGetRequisets("/users/payments/pricing");
    setPricing(res.data.data);
    
  }
catch(err){
  console.error(err);
}}
const handlePayment=async()=>{
  setmodaloading(true);
  const data={
    [selectedPlan.color?"planName": "packName"]:selectedPlan.key,
    provider:selectedProvider
  }
 
try{
  const result=await httpPostRequisets('/users/payments/checkout', data);
  console.log(result);
  if(result.data.success){
    window.open(result.data.data.checkout.checkoutUrl, '_blank');
    message.success(t('pricing.payment_redirect'));
    setModalFnOpen(false);  
   } 
   else{
    message.error(t('pricing.payment_error'));
   }

  }
  catch(err){
    console.error(err);
  }
  finally{
    setmodaloading(false);
  }
}

    const pricelangCredits=(price,key)=>{
      let current_lang=i18n.language;
      if (current_lang == 'uz') {
  if (key === "SINGLE") return "7 000 so'm";
  else if (key == "MINI") return "20 000 so'm";
  else if (key == "BASIC") return "33 000 so'm";
  else if (key == "POWER") return "60 000 so'm";
} 
else if (current_lang == 'en') {
  if (key === "SINGLE") return "0.59 $";
  else if (key === "MINI") return "1.69 $";
  else if (key === "BASIC") return "2.79 $";
  else if (key === "POWER") return "4.99 $";
} 
else if (current_lang == 'ru') {
  if (key === "SINGLE") return "44.25 ₽";
  else if (key === "MINI") return "126.75 ₽";
  else if (key === "BASIC") return "209.25 ₽";
  else if (key === "POWER") return "374.25 ₽";
}
      
    }
    
    const pricelang=(price,key)=>{
      let current_lang=i18n.language;
      if (current_lang === "en") {
    if (key === "FREE") return "0 $";
    else if (key === "PLUS") return "3.99 $";
    else if (key === "PRO") return "6.99 $";
    else if (key === "PRIME") return "11.99 $";
} 
else if (current_lang === "ru") {
    if (key === "FREE") return "0 ₽";
    else if (key === "PLUS") return "299.25 ₽";
    else if (key === "PRO") return "524.25 ₽";
    else if (key === "PRIME") return "899.25 ₽";
} 
else if (current_lang === "uz") {
    if (key === "FREE") return "0 so'm";
    else if (key === "PLUS") return "48 000 so'm";
    else if (key === "PRO") return "84 000 so'm";
    else if (key === "PRIME") return "144 000 so'm";
}
    
      
    }
    const handleUpgrade = (plan) => {
      if (plan.key === 'FREE') return;
      setModalFnOpen(true);
      setSelectedPlan(plan);
console.log(plan);
      
    }
    const handleBuyCredit = (credit) => {
      setModalFnOpen(true);
        setSelectedPlan(credit);
        console.log(credit)
      
    }
  return (
    
        <div className='pricing_page'>
          <button class="back-btn" onClick={()=>{navigate('/')}}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
  <span>{t('back_button')}</span>
</button>
      <div className='pricing_header'>
        <h1>{t('pricing.title')}</h1>
        <p>{t('pricing.subtitle')}</p>
        {userPlan && (
          <div className='current_plan_note'>
            {t('pricing.current_plan')}: <span>{userPlan.plan ? t(`pricing.plans.${userPlan.plan}`) : t('pricing.plans.FREE')}</span>
            {' — '}
            {userPlan.monthlyGenerationUsed}/{userPlan.monthlyGenerationLimit} {t('pricing.used')}
          </div>
        )}
      </div>

      {/* Plan kartalar */}
      <div className='section_label'>{t('pricing.monthly_plans')}</div>
      <div className='plans_grid'>
        {PLANS.map((plan) => {
          const isCurrent = userPlan?.plan === plan.key;
          return (
            <div className={`plan_card ${plan.popular ? 'popular' : ''}`} key={plan.key}>
              {plan.popular && <div className='popular_badge'>{t('pricing.popular')}</div>}
              <div className='plan_name' style={{ color: plan.color }}>{t(`pricing.plans.${plan.key}`)}</div>
              <div className='plan_count'>{plan.count} </div>
              <div className='plan_unit'>{t('pricing.per_month')}</div>
              <div className='plan_price'>{pricelang(plan.price, plan.key)}</div>
              <div className='plan_divider' />
              {FEATURES.map((f, i) => (
                <div className={`plan_feature ${!plan.features[i] ? 'dim' : ''}`} key={f}>
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {t(`pricing.feature_${f}`)}
                </div>
              ))}
              <button
                className={`plan_btn ${isCurrent ? 'current' : 'upgrade'}`}
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent || loading === plan.key}
              >
                {loading === plan.key ? t('common.loading') : isCurrent ? t('pricing.active_plan') : t('pricing.upgrade_btn')}
              </button>
            </div>
          );
        })}
      </div>

      <div className='section_label' style={{ marginTop: 32 }}>{t('pricing.credit_packs')}</div>
      <div className='credits_grid'>
        {CREDITS.map((credit) => (
          <div className='credit_card' key={credit.key}>
            <div className='credit_name'>{t(`pricing.packs.${credit.key}`)}</div>
            <div className='credit_count'>{credit.count}</div>
            <div className='credit_unit'>{t('pricing.generations_count')}</div>
            <div className='credit_price'>{pricelangCredits(credit.price, credit.key)}</div>

            <button
              className='credit_btn'
              onClick={() => handleBuyCredit(credit)}
              disabled={creditLoad === credit.key}
            >
              {creditLoad === credit.key ? t('common.loading') : t('pricing.buy_now')}
            </button>
          </div>
        ))}
      </div>
       <Modal className='modal_box'
        // {...sharedProps}
        title={t('pricing.payment_confirm')}
       
      
        open={modalFnOpen}
        onOk={() => setModalFnOpen(false)}
        onCancel={() => setModalFnOpen(false)}
        maskClosable={true}
    mask={{
     style: {
        backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      } ,
    }}
        footer={[
          <Button key="back" onClick={() => setModalFnOpen(false)}>
           {t('pricing.cancel')}
            </Button>,
            <Button key="submit"
            type='primary'
            loading={modalloading}
            onClick={handlePayment}
            style={{backgroundColor:'#7C3AED'}}>
              {t('pricing.pay_now')}
            </Button>]}
            mask={{ enabled: true, blur: true }}
      >
        
       {selectedPlan && (
    <div className="modal-body-content">
      <div className='ant_body_p'>
        {selectedPlan.color?<p>{t('pricing.selected_plan')}: <strong>{selectedPlan.key}</strong></p>:<></>}
      {
        selectedPlan.color?<p>{t('pricing.price')}: <strong>{pricelang(selectedPlan.price, selectedPlan.key)}</strong></p>:<p>{t('pricing.price')}: <strong>{pricelangCredits(selectedPlan.price, selectedPlan.key)}</strong></p>
      }
      
      </div>
      
      <div style={{ marginTop: 20 }}>
        <p>{t('pricing.select_payment_method')}:</p>
        <Radio.Group 
          onChange={(e) => setSelectedProvider(e.target.value)} 
          value={selectedProvider}
          className="payment-radio-group"
        >
          {providers.filter(p=>p.enabled).map(p=>(
            <Radio.Button value={p.name} style={{ marginRight: 10 }}>
            <div className='provider-wrapper'>
              <img src={p.name=='CLICK'?click:payme} alt={p.name} className='provider-img'/>
              <span>{p.title}</span>
              </div></Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </div>
  )}
      </Modal>
    </div>
  )
}
