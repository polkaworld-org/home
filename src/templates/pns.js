import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import searchIcon from '../images/search.svg';
import { Layout } from '../components/common';
import { MetaData } from '../components/common/meta';

const Pns = ({ data, location }) => {
  const [name, setName] = useState('')
  const [queryName, setQueryName] = useState(false)
  const [available, setAvailable] = useState(false)
  const [address, setAddress] = useState('')
  const [mappedAddress, setMappedAddress] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitErrMsg, setSubmitErrMsg] = useState('')

  function clearStatus() {
    setAvailable(false)
    setQueryName(false)
    setMappedAddress('')
    setAddress('')
    setErrMsg('')
    setSubmitErrMsg('')
    setSuccessMsg('')
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
    setErrMsg('')
    return true
  }

  async function query() {
    clearStatus()
    if (!check()) {
      return
    }

    const url = 'https://laijiechan.com/api/v1/pns/query/?name=' + name
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
    const url = `https://laijiechan.com/api/v1/pns/map/?name=${name}&address=${address}`

    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.ok) {
          console.log('success')
          setSuccessMsg('注册成功')
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
                onChange={e => setName(e.target.value)}
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
                  <span>{name}.dot</span>
                  <span className={available ? 'green' : 'red'}>
                    {available ? '可用' : '不可用'}
                  </span>
                </div>
                {
                  available &&
                  <div className="submit">
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          submit();
                        }
                      }}
                      placeholder="请输入该域名映射的地址"
                    />
                    <button onClick={() => {
                      submit();
                    }}>免费注册</button>
                  </div>
                }
                {
                  !available &&
                  <div className="address">
                    <span>已映射地址：</span>
                    <span>{mappedAddress}</span>
                  </div>
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
  width: 60%;
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
    /* border: none; */
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
  width: 60%;
  margin-top: 20px;
  span {
    color: red;
    font-size: 20px;
  }
`

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
  margin-top: 20px;
  span {
    color: green;
    font-size: 20px;
  }
`

const PnsCard = styled.div`
  width: 60%;
  height: 70px;
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
    margin-top: 20px;
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
  button {
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

export default Pns;
