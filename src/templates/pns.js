import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import searchIcon from '../images/search.svg';
import { Layout } from '../components/common';
import { MetaData } from '../components/common/meta';
import Identicon from '@polkadot/react-identicon';
import IconBox from '../components/IconBox';

const baseUrl = 'https://laijiechan.com/api/v1/pns/'
const imageBaseUrl = 'https://laijiechan.com/pub_media/'
const kusamaUrl = 'https://polkascan.io/pre/kusama/account/'

const Pns = ({ data, location }) => {
  const [name, setName] = useState('')
  const [queryName, setQueryName] = useState(false)
  const [available, setAvailable] = useState(false)
  const [address, setAddress] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [logo, setLogo] = useState(null)
  const [registeredNames, setRegisteredNames] = useState([])
  const [previewLogo, setPreviewLogo] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitErrMsg, setSubmitErrMsg] = useState('')

  useEffect(() => {
    fetchRegisteredNames();
  }, []);

  function clearStatus() {
    setAvailable(false)
    setQueryName(false)
    setMappedAddress('')
    setAddress('')
    setErrMsg('')
    setSubmitErrMsg('')
    setSuccessMsg('')
    setPreviewLogo(null)
    setDesc('')
  }

  const fileChangedHandler = event => {
    setLogo(event.target.files[0])
    let reader = new FileReader()
    reader.onloadend = () => {
      setPreviewLogo(reader.result)
    }
 
    reader.readAsDataURL(event.target.files[0])
  }

  async function fetchRegisteredNames() {
    const url = `${baseUrl}query/all/`
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ok) {
          setRegisteredNames(json.data)
        }
      })
      .catch(err => {
        console.log(err)
      }) 
  }

  function check() {
    if (!name) {
      setErrMsg('请输入地址')
      return false
    }
    if (name.length < 3) {
      setErrMsg('地址长度必须大于3')
      return false
    }
    if (name.length > 12) {
      setErrMsg('地址长度必须小于12')
      return false
    }
    const pattern = /^[a-z0-9]*$/
    if (!pattern.test(name)) {
      setErrMsg('地址输入不合法')
      return false
    }
    setErrMsg('')
    return true
  }

  async function query() {
    clearStatus()
    if (!check()) {
      return
    }

    const url = `${baseUrl}query/?name=${name}`
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ok) {
          setAvailable(json.data.available)
          if (!json.data.available) {
            setMappedAddress(json.data.address)
          }
          setQueryName(true)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  async function submit() {
    if (!address) {
      setSubmitErrMsg('请输入映射地址')
      return
    }
    if (address.length < 47 || address.length > 50) {
      setSubmitErrMsg('请输入合法地址')
      return
    }
    setSubmitErrMsg('')
    setSuccessMsg('')
    const url = `${baseUrl}map/`

    const fd = new FormData()
    fd.append('logo', logo)
    fd.append('name', name)
    fd.append('desc', desc)
    fd.append('address', address)
    fetch(url, {
      method: 'POST',
      body: fd,
    })
      .then(response => response.json())
      .then(json => {
        if (json.ok) {
          console.log('success')
          setSuccessMsg('注册成功')
          fetchRegisteredNames()
        } else {
          setSubmitErrMsg(json.reason.err)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <>
      <MetaData data={data} location={location} type="article" />
      <Layout>
        <div className="container">
          <article className="pns" style={pnsStyle}>
            <p style={{ marginTop: '40px', fontSize: '24px', color: '#1F215F' }}>Polkadot 域名注册系统</p>
            <SearchArea>
              <input
                type="text"
                value={name}
                onChange={e => {
                  clearStatus()
                  setName(e.target.value)
                }}
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    query();
                  }
                }}
                placeholder="请输入你想要查询的域名"
              />
              <button
                onClick={() => query()}
              >
              查询
              </button>
            </SearchArea>
            {
              errMsg && <ErrMsg><span>{errMsg}</span></ErrMsg>
            }
            {
              queryName ? 
              <PnsCard>
                <div className="name">
                  <span>{name}.ksm</span>
                  <span className={available ? 'green' : 'red'}>
                    {available ? '地址可用，请赶快注册吧' : '地址已被注册'}
                  </span>
                </div>
                {
                  !available ?
                  <div className="address">
                    <span>已映射地址：</span>
                    <span>{mappedAddress}</span>
                  </div>
                  :
                  <>
                  <InputItem>
                    <span>映射地址(必填): </span>
                    <input
                      type="text"
                      value={address}
                      onChange={e => {
                        setSubmitErrMsg('')
                        setAddress(e.target.value)
                      }}
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          submit();
                        }
                      }}
                      placeholder="请输入该域名的映射地址"
                    />
                  </InputItem>
                  <InputItem>
                    <span>域名简介: </span>
                    <input
                      type="text"
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      placeholder="请输入域名简介"
                    />
                  </InputItem>
                  <LogoItem>
                    <span>域名logo：</span>
                    <input
                      type="file"
                      accept="image/jpeg, image/gif, image/png, image/bmp"
                      onChange={fileChangedHandler}
                    />
                    {
                      previewLogo && <img src={previewLogo} alt="icon" width="200" />
                    }
                  </LogoItem>
                  <button onClick={() => {
                    submit();
                  }}>免费注册</button>
                  </>
                }
                {
                  submitErrMsg && <ErrMsg><span>{submitErrMsg}</span></ErrMsg>
                }
                {
                  successMsg && <SuccessMsg><span>{successMsg}</span></SuccessMsg>
                }
              </PnsCard>
              :
              null
            }
            <RegisteredArea>
              {
                registeredNames.map((item, index) => (
                  <div className="registered-item" key={index}>
                    {
                      item.logo ?
                      <img src={imageBaseUrl + item.logo} alt=''></img>
                      :
                      <IconBox
                        icon={
                          <Identicon
                            className='icon'
                            size={64}
                            theme='substrate'
                            value={item.address}
                          />
                        }
                      />                   
                    }
                    <div className="detail">
                      <div className="detail-item">
                        <span className="detail-item-label">域名地址：</span>
                        <span className="detail-item-value">{item.name}.ksm</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-item-label">映射地址：</span>
                        <a className="detail-item-value" href={kusamaUrl + item.address} target="_blank">{item.address}</a>
                      </div>
                      <div className="detail-item">
                        <span className="detail-item-label">域名简介：</span>
                        <span className="detail-item-value">{item.desc}</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </RegisteredArea>
          </article>
        </div>
      </Layout>
    </>
  );
};

const pnsStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}

const SearchArea = styled.div`
  display: flex;
  width: 80%;
  position: relative;
  z-index: 10000;

  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon}) no-repeat;
  }
  input {
    padding: 10px 0 10px 55px;
    width: 80%;
    border-radius: 0;
    font-size: 20px;
    font-family: Overpass;
    font-weight: 100;

    &:focus {
      outline: 0;
    }

    &::placeholder {
      color: #ccd4da;
    }
  }
  button {
    background: #1F215F;
    color: rgba(255, 255, 255, 0.7);
    font-size: 22px;
    font-family: Overpass;
    padding: 20px 0;
    height: 70px;
    width: 20%;
    border: none;

    &:hover {
      cursor: pointer;
      color: white;
    }
  }
`

const ErrMsg = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 20px;
  span {
    color: red;
    font-size: 20px;
  }
`

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 20px;
  span {
    color: green;
    font-size: 20px;
  }
`

const LogoItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  span {
    width: 20%;
  }
  input {

  }
`

const InputItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  span {
    width: 20%;
  }
  input {
    padding: 10px 0 10px 10px;
    width: 80%;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    &:focus {
      outline: 0;
    }
    &::placeholder {
      color: #ccd4da;
    } 
  }
`

const PnsCard = styled.div`
  width: 80%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  .name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .green {
      color: green;
    }
    .red {
      color: red;
    }
  }
  .submit {
    margin-top: 20px;
  }
  .address {
    width: 100%;
    margin-top: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    margin-top: 20px;
    margin-left: 40%;
    background: #1F215F;
    color: rgba(255, 255, 255, 0.7);
    font-size: 20px;
    font-family: Overpass;
    padding: 10px 0;
    height: 50px;
    width: 20%;
    border: none;

    &:hover {
      cursor: pointer;
      color: white;
    } 
  }
`

const RegisteredArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 80px;
  /* :nth-child(3n+1) {
    margin-left: 0;
  } */
  .registered-item {
    max-width: 350px;
    width: 350px;
    height: 100px;
    padding: 14px;
    display: flex;
    justify-content: space-between;
    border: 1px solid rgba(191, 191, 191, .7);
    margin-top: 20px;
    a, span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap
    }
    img {
      width: 50px;
      height: 50px;
    }
    .detail {
      display: flex;
      flex-direction: column;
      width: 250px;
      .detail-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .detail-item-label {
          width: 75px;
        }
        .detail-item-value {
          width: 165px;
          text-align: right;
        }
      }
    }
  }
`

export default Pns;
