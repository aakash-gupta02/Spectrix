import React from 'react'

const Container = ({ children }) => {
    return (
        <section className="w-full px-4 pb-10 pt-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
                {children}
            </div>
        </section>
    )
}

export default Container