import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";
export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <Footer container className="border border-t-8 border-red-500">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link to="/" className="flex items-center">
              <img
                src={
                  theme === "dark"
                    ? "/FindNestYellowLogo-R.svg"
                    : "/FindNestRedLogo-W.svg"
                }
                className="mr-2 h-6 sm:h-9"
                alt="FindNest Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                FindNest
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Capstone Project
                </Footer.Link>
                <Footer.Link
                  href="https://youtu.be/76KsgvKrqnI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Papasara Mi
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/hanako0311/FindNest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="FindNest"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon
              href="https://github.com/sahandghavidel"
              icon={BsGithub}
            />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
