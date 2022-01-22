import React, { useEffect, useState } from 'react'
import InfoBoxes from '../common/InfoBoxes/InfoBoxes'
import {
  message,
  Alert,
  Breadcrumb,
  Button,
  Col,
  Descriptions,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  PageHeader,
  Row,
  Switch,
  Tag,
  Typography,
  Skeleton,
} from 'antd'
import { Link } from 'react-router-dom'
import Marquee from 'react-fast-marquee'
import styles from './Profile.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from '../../store/actionCreators/ProfileActionCreator'
import * as dayjs from 'dayjs'

const Profile = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProfile())
  }, [])
  // finance
  const [deposit, setDeposit] = useState(0)
  const [fee, setFee] = useState(0)
  const [paidDays, setDays] = useState(0)
  const [paidTo, setPaidTo] = useState('0000-00-00')
  const [tariffName, setTariffName] = useState('')
  const [tariffState, setTariffState] = useState('')
  const [tariffInfo, setTariffInfo] = useState(``)
  const [isDebtor, setIsDebtor] = useState(false)
  const [visible, setVisible] = React.useState(false)
  // personal information
  const [login, setLogin] = useState('')
  const [fio, setFio] = useState('')
  const [uid, setUid] = useState('')
  const [address, setAddress] = useState({})
  const [personalPhone, setPersonalPhone] = useState('')
  const [contract, setContract] = useState('')
  const [registration, setRegistration] = useState('')
  const [activation, setActivation] = useState('')
  const [phone, setPhone] = useState({
    main: '0721044880',
    secondary: '0664841472',
  })
  const profile = useSelector(state => state.profile)
  // finance effects
  useEffect(() => {
    // устанивливаю баланс
    profile.data?.bill?.deposit && setDeposit(+profile.data.bill.deposit)
  }, [profile.data.bill])
  useEffect(() => {
    // устанавлюваю дневную абоненплату  и назваение тарифа
    profile.data?.dvmain?.tariff && setFee(profile.data.dvmain.tariff.day_fee)
    profile.data?.dvmain?.tariff &&
      setTariffName(profile.data.dvmain.tariff.name)
  }, [profile.data.bill, profile.data.dvmain])
  useEffect(() => {
    //устанавливаю статус тарифного плана
    if (profile?.data?.dvmain?.disable) {
      switch (profile.data.dvmain.disable) {
        case 0:
          setTariffState('Активно')
          break
        case 1:
          setTariffState('Отключено')
          break
        case 2:
          setTariffState('Не активизирован')
          break
        case 3:
          setTariffState('Приостановление')
          break
        case 4:
          setTariffState('Отключено: Неуплата')
          break
        case 5:
          setTariffState('Слишком маленький депозит')
          break
        default:
          setTariffState('Недоступно')
      }
    }
  }, [profile.data.dvmain])
  useEffect(() => {
    // устанавливаю количество оплаченных дней
    setDays(Math.floor(deposit / fee))
  }, [deposit, fee])
  useEffect(() => {
    // устанавливаю дату окончани тарифа
    setPaidTo(dayjs().add(paidDays, 'day').format('YYYY-MM-DD'))
  }, [paidDays])
  useEffect(() => {
    setTariffInfo(`${tariffName} : ${fee} руб.`)
  }, [tariffName, fee])
  //personal info effects
  useEffect(() => {
    // устанавливаю згачение логина
    profile.data?.id && setLogin(profile.data.id)
  }, [profile.data.id])
  useEffect(() => {
    profile.data?.users_pi && setFio(profile.data.users_pi.fio)
  }, [profile.data.users_pi])
  useEffect(() => {
    const ls = String(profile.data.uid)
    let newLs = ''
    for (let i = 0; i < 6 - ls.length; i++) {
      newLs += 0
    }
    profile.data?.uid && setUid(`${newLs}${ls}`)
  }, [profile.data.uid])
  useEffect(() => {
    profile.data?.users_pi &&
      setAddress({
        street: profile.data.users_pi.address_street,
        flat: profile.data.users_pi.address_flat,
        build: profile.data.users_pi.address_build,
      })
  }, [profile.data.users_pi])
  useEffect(() => {
    profile.data?.users_pi && setPersonalPhone(profile.data.users_pi.phone)
  }, [profile.data.users_pi])
  useEffect(() => {
    profile.data?.users_pi && setContract(profile.data.users_pi.contract_id)
  }, [profile.data.users_pi])
  useEffect(() => {
    profile.data && setRegistration(profile.data.registration)
  }, [profile.data.registration])
  useEffect(() => {
    profile.data && setActivation(profile.data.activate)
  }, [profile.data.activate])

  const success = text => {
    message.success(text).then(res => console.log(res))
  }

  const error = text => {
    message.error(text).then(res => console.log(res))
  }
  const showModalPhoneEdit = () => {
    setVisible(true)
  }

  const onCreate = values => {
    console.log('Received values of form: ', values)
    setPhone({ main: values.mainPhone, secondary: values.secondaryPhone })
    setVisible(false)
  }
  const handleSuccessPhone = () => {
    setVisible(false)
    success('Изменения приняты')
  }
  const handleSuccessPassword = () => {
    success('Пароль успешно уизменен')
  }
  const handleCancelPhone = () => {
    setVisible(false)
    error('Отменили')
  }
  const routes = [
    {
      path: 'index',
      breadcrumbName: 'Домашняя',
    },
    {
      path: '/profile',
      breadcrumbName: 'Профиль',
    },
  ]
  function itemRender(route, params, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={paths.join('/')} key={paths}>
        {route.breadcrumbName}
      </Link>
    )
  }

  const menu = (
    <Menu key={'menu1'}>
      <Menu.Item onClick={showModalPhoneEdit} key="1">
        Редактировать телефон
      </Menu.Item>
      <Menu.Item onClick={handleSuccessPassword} key="2">
        Изменить пароль
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setIsDebtor(!isDebtor)
          setDeposit(-deposit)
          if (!isDebtor) {
            success('Активирован долг по лицевому счету')
          } else {
            success('Деактивирован долг по лицевому счету')
          }
        }}
        key="3">
        Долг вкл/выкл
      </Menu.Item>
      <Menu.Item onClick={() => setDeposit(deposit + 20)} key="4">
        Добавить денег абоненту
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onOk={handleSuccessPhone}
        onCancel={handleCancelPhone}
        phone={phone}
        sms={false}
      />
      <InfoBoxes
        switch={true}
        deposit={deposit}
        paidDays={paidDays}
        fee={fee}
      />
      {isDebtor && (
        <Alert
          banner
          type="error"
          message={
            <Marquee gradient={false} pauseOnHover={true}>
              У вас не достаточно средств на счету. Для возобновления
              пользования услугой интернет нужно внести денежные средства на
              лицевой счет, который указан в вашем договоре
            </Marquee>
          }
        />
      )}
      <PageHeader
        style={{ height: '100%' }}
        breadcrumb={<Breadcrumb itemRender={itemRender} routes={routes} />}
        ghost={false}
        onBack={() => window.history.back()}
        title="Профиль"
        subTitle={login}
        extra={[
          <Dropdown
            overlay={menu}
            placement="bottomRight"
            arrow
            key={'pagekey1'}>
            <Button type="primary" key={1}>
              Дополнительно
            </Button>
          </Dropdown>,
        ]}>
        <Row gutter={[16, 16]}>
          <Col
            xs={{ span: 24 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}>
            {profile.isLoading ? (
              <Skeleton active />
            ) : (
              <Finance
                deposit={deposit}
                paidTo={paidTo}
                paidDays={paidDays}
                taariffName={tariffName}
                tariffState={tariffState}
                tariffInfo={tariffInfo}
                fee={fee}
              />
            )}
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}>
            <div className="mb-4">
              {profile.isLoading ? (
                <Skeleton active />
              ) : (
                <PersonalInformation
                  activation={activation}
                  registration={registration}
                  address={address}
                  phone={phone}
                  personalPhone={personalPhone}
                  contract={contract}
                  login={login}
                  fio={fio}
                  uid={uid}
                />
              )}
            </div>
          </Col>
        </Row>
      </PageHeader>
    </>
  )
}
const Finance = props => {
  return (
    <Descriptions
      title={
        <h6 className={`${styles.divider} ${styles.gradient}`}>Финансы</h6>
      }
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
      <Descriptions.Item label="Баланс руб." key={1}>
        <div style={{ fontSize: '16px' }}>
          {props.deposit >= 0 ? (
            props.deposit
          ) : (
            <Tag color="error" style={{ fontSize: '16px', padding: '10px' }}>
              {props.deposit}
            </Tag>
          )}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Тарифный пакет" key={2}>
        <div style={{ fontSize: '15px' }}>{props.taariffName}</div>
      </Descriptions.Item>
      <Descriptions.Item label="Статус тарифного плана" key={3}>
        {props.tariffState}
      </Descriptions.Item>
      <Descriptions.Item label="Оплачено дней" key={4}>
        {props.paidDays}
      </Descriptions.Item>
      <Descriptions.Item label="Дата окончания тарифа" key={5}>
        {props.paidTo}
      </Descriptions.Item>

      <Descriptions.Item label="Оплата за тарифный пакет, руб./сутки" key={6}>
        {props.tariffInfo}
      </Descriptions.Item>
      <Descriptions.Item label="К оплате, руб./сутки" key={7}>
        <div style={{ fontSize: '15px' }}>{props.fee} руб.</div>
      </Descriptions.Item>
    </Descriptions>
  )
}
const PersonalInformation = props => {
  return (
    <Descriptions
      layout=""
      // size="middle"
      title={
        <h6 className={`${styles.divider} ${styles.gradient}`}>
          Личная информация
        </h6>
      }
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
      key={1}>
      <Descriptions.Item label="ФИО" key={2}>
        {props.fio}
      </Descriptions.Item>
      <Descriptions.Item label="Логин" key={3}>
        {props.login}
      </Descriptions.Item>
      <Descriptions.Item
        label="Л/С"
        contentStyle={{ whiteSpace: 'nowrap' }}
        key={4}>
        <Typography.Paragraph
          copyable={{
            tooltips: [
              'Нажмите, чтобы скопировать текст в буфер обмена',
              'Успешно скопировано',
            ],
          }}>
          {props.uid}
        </Typography.Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label="Улица" key={5}>
        {props.address.street}
      </Descriptions.Item>
      <Descriptions.Item label="Дом" key={6}>
        {props.address.build}
      </Descriptions.Item>
      <Descriptions.Item label="Кваритра" key={7}>
        {props.address.flat}
      </Descriptions.Item>
      <Descriptions.Item
        label="Телефон"
        contentStyle={{ whiteSpace: 'nowrap' }}
        key={11}>
        {props.personalPhone === '0' ? '' : props.personalPhone}
      </Descriptions.Item>
      <Descriptions.Item
        label="№ договра"
        contentStyle={{ whiteSpace: 'nowrap' }}
        key={13}>
        {props.contract === '0' ? '' : props.contract}
      </Descriptions.Item>
      <Descriptions.Item
        label="Дата регистрации"
        contentStyle={{ whiteSpace: 'nowrap' }}
        key={15}>
        {props.registration === '0' ? '' : props.registration}
      </Descriptions.Item>
      <Descriptions.Item
        label="Дата активации"
        contentStyle={{ whiteSpace: 'nowrap' }}
        key={16}>
        {props.activation === '0' ? '' : props.activation}
      </Descriptions.Item>
    </Descriptions>
  )
}
const CollectionCreateForm = ({
  visible,
  onCreate,
  onCancel,
  onOk,
  phone,
  sms,
}) => {
  const [form] = Form.useForm()
  const [smsChecked, setSmsChecked] = useState(sms)
  const onChange = () => {
    setSmsChecked(!smsChecked)
  }

  const onSubmitForm = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onCreate(values)
        onOk()
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  return (
    <Modal
      visible={visible}
      title="Изменить номер телефона"
      okText="Принять"
      cancelText="Отменить"
      onCancel={onCancel}
      onOk={onSubmitForm}>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          mainPhone: phone.main,
          secondaryPhone: phone.secondary,
        }}>
        <Form.Item
          name="mainPhone"
          label="Основной номер телефона"
          rules={[
            {
              required: true,
              message: 'Пожалуста, введите номер телефона',
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="secondaryPhone"
          label="Дополнительный номер телефона"
          rules={[
            {
              required: true,
              message: 'Пожалуста, введите номер телефона',
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item label="sms-информаривание" valuePropName="checked">
          <Switch cheched={smsChecked} onChange={onChange} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Profile
