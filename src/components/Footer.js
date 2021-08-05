import React from "react"
import styles from "../app.module.css"
import {isMobile} from 'react-device-detect'
import Nav from "react-bootstrap/Nav";

const Footer = () => {

    return (
        <div className={styles.footer}>
            <div className={[isMobile ? "" : "d-flex", "justify-content-center", "mb-4"].join(' ')}>
                <div className={[styles.footerInfoBox, styles.border].join(' ')}>
                    <div className={styles.footerTitle}>
                        (주) 두드림퀵 사업자 정보
                    </div>
                    <div className={styles.footerText}>
                        <div>상호명: 두드림퀵</div>
                        <div>대표: 이다인</div>
                        <div>사업자등록번호 : 811-88-01483</div>
                        <div>통신판매번호: 제2019-서울금천-1887호</div>
                        <div>본사: 서울특별시 금천구 가산디지털2로 98, 롯데IT캐슬 2동 1107호</div>
                        <div>(비상주 사무실이니 방문을 원하신다면 사전에 문의해 주시기 바랍니다.)</div>
                    </div>
                </div>
                <div className={[styles.footerInfoBox, "text-center"].join(' ')}>
                    <Nav.Link href="https://pf.kakao.com/_jSPaj" target="_blank">
                        <img
                            src="/ic_kakao_channel.png"
                            height="80"
                            alt="두드림퀵"/>
                    </Nav.Link>
                    <div>
                        <div className={styles.footerTitle}>@두드림퀵</div>
                        <div className={styles.footerText}>카카오톡 채널 고객센터 : 평일 AM 9:00 ~ PM 6:00</div>
                    </div>
                </div>
            </div>
            <div className={styles.footerPolicy}>
                <a href="/policy/use" className={styles.footerPolicyLink}>이용 약관</a>
                <a href="/policy/personal_information" className={styles.footerPolicyLink}>개인정보 처리 방침</a>
            </div>
        </div>
    )
}

export default Footer
